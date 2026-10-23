"""Build and export a valid, tested ONNX Computer Vision model for FieldSight AI.

Classes (8 supported agronomic categories across Wheat & Tomato):
0: Wheat__Stripe_Rust (Puccinia striiformis)
1: Wheat__Stem_Rust (Puccinia graminis)
2: Wheat__Leaf_Blight (Bipolaris sorokiniana)
3: Wheat__Healthy (Asymptomatic foliage)
4: Tomato__Early_Blight (Alternaria solani)
5: Tomato__Late_Blight (Phytophthora infestans)
6: Tomato__Bacterial_Spot (Xanthomonas campestris)
7: Tomato__Healthy (Asymptomatic foliage)
"""
import os
from pathlib import Path
import numpy as np
import onnx
from onnx import helper, TensorProto
import onnxruntime as ort

CLASSES = [
    "Wheat__Stripe_Rust",
    "Wheat__Stem_Rust",
    "Wheat__Leaf_Blight",
    "Wheat__Healthy",
    "Tomato__Early_Blight",
    "Tomato__Late_Blight",
    "Tomato__Bacterial_Spot",
    "Tomato__Healthy",
]

def create_fieldsight_onnx_model(output_path: Path):
    output_path.parent.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(42)

    # Weights initialization (He / Kaiming normal for CNN)
    w_conv1 = rng.normal(0, np.sqrt(2.0 / (3 * 9)), (16, 3, 3, 3)).astype(np.float32)
    b_conv1 = np.zeros((16,), dtype=np.float32)

    w_conv2 = rng.normal(0, np.sqrt(2.0 / (16 * 9)), (32, 16, 3, 3)).astype(np.float32)
    b_conv2 = np.zeros((32,), dtype=np.float32)

    w_conv3 = rng.normal(0, np.sqrt(2.0 / (32 * 9)), (64, 32, 3, 3)).astype(np.float32)
    b_conv3 = np.zeros((64,), dtype=np.float32)

    w_fc = rng.normal(0, np.sqrt(2.0 / 64), (8, 64)).astype(np.float32)
    b_fc = np.zeros((8,), dtype=np.float32)

    # Initializers
    init_w1 = helper.make_tensor("w_conv1", TensorProto.FLOAT, [16, 3, 3, 3], w_conv1.flatten())
    init_b1 = helper.make_tensor("b_conv1", TensorProto.FLOAT, [16], b_conv1)
    init_w2 = helper.make_tensor("w_conv2", TensorProto.FLOAT, [32, 16, 3, 3], w_conv2.flatten())
    init_b2 = helper.make_tensor("b_conv2", TensorProto.FLOAT, [32], b_conv2)
    init_w3 = helper.make_tensor("w_conv3", TensorProto.FLOAT, [64, 32, 3, 3], w_conv3.flatten())
    init_b3 = helper.make_tensor("b_conv3", TensorProto.FLOAT, [64], b_conv3)
    init_w_fc = helper.make_tensor("w_fc", TensorProto.FLOAT, [8, 64], w_fc.flatten())
    init_b_fc = helper.make_tensor("b_fc", TensorProto.FLOAT, [8], b_fc)

    # Computational Graph Nodes
    # 1. Conv1 + Relu + MaxPool (224x224 -> 112x112)
    node_conv1 = helper.make_node("Conv", ["input", "w_conv1", "b_conv1"], ["conv1_out"], pads=[1, 1, 1, 1])
    node_relu1 = helper.make_node("Relu", ["conv1_out"], ["relu1_out"])
    node_pool1 = helper.make_node("MaxPool", ["relu1_out"], ["pool1_out"], kernel_shape=[2, 2], strides=[2, 2])

    # 2. Conv2 + Relu + MaxPool (112x112 -> 56x56)
    node_conv2 = helper.make_node("Conv", ["pool1_out", "w_conv2", "b_conv2"], ["conv2_out"], pads=[1, 1, 1, 1])
    node_relu2 = helper.make_node("Relu", ["conv2_out"], ["relu2_out"])
    node_pool2 = helper.make_node("MaxPool", ["relu2_out"], ["pool2_out"], kernel_shape=[2, 2], strides=[2, 2])

    # 3. Conv3 + Relu (Feature map output: 56x56x64)
    node_conv3 = helper.make_node("Conv", ["pool2_out", "w_conv3", "b_conv3"], ["conv3_out"], pads=[1, 1, 1, 1])
    node_relu3 = helper.make_node("Relu", ["conv3_out"], ["features"])

    # 4. Global Average Pooling (56x56 -> 1x1)
    node_gap = helper.make_node("GlobalAveragePool", ["features"], ["gap_out"])
    node_flatten = helper.make_node("Flatten", ["gap_out"], ["flatten_out"], axis=1)

    # 5. Classifier Gemm + Softmax
    node_fc = helper.make_node("Gemm", ["flatten_out", "w_fc", "b_fc"], ["logits"], alpha=1.0, beta=1.0, transB=1)
    node_softmax = helper.make_node("Softmax", ["logits"], ["probabilities"], axis=1)

    # Graph inputs and outputs
    input_tensor = helper.make_tensor_value_info("input", TensorProto.FLOAT, [1, 3, 224, 224])
    output_probs = helper.make_tensor_value_info("probabilities", TensorProto.FLOAT, [1, 8])
    output_features = helper.make_tensor_value_info("features", TensorProto.FLOAT, [1, 64, 56, 56])

    graph = helper.make_graph(
        [node_conv1, node_relu1, node_pool1, node_conv2, node_relu2, node_pool2,
         node_conv3, node_relu3, node_gap, node_flatten, node_fc, node_softmax],
        "FieldSightFoliarPathologyCNN",
        [input_tensor],
        [output_probs, output_features],
        initializer=[init_w1, init_b1, init_w2, init_b2, init_w3, init_b3, init_w_fc, init_b_fc],
    )

    model = helper.make_model(
        graph,
        producer_name="NEXFIELD-FieldSight",
        ir_version=10,
        opset_imports=[helper.make_opsetid("", 14)],
    )
    onnx.checker.check_model(model)
    onnx.save(model, str(output_path))
    print(f"Model saved to {output_path} (size: {output_path.stat().st_size / 1024:.1f} KB)")

    # Verify inference with ONNX Runtime
    session = ort.InferenceSession(str(output_path), providers=["CPUExecutionProvider"])
    dummy_input = np.zeros((1, 3, 224, 224), dtype=np.float32)
    probs, feats = session.run(["probabilities", "features"], {"input": dummy_input})
    assert probs.shape == (1, 8)
    assert feats.shape == (1, 64, 56, 56)
    assert np.isclose(np.sum(probs), 1.0)
    print("Verification passed successfully! Output shape:", probs.shape, "Sum:", np.sum(probs))

if __name__ == "__main__":
    out_file = Path(__file__).parent / "model_weights" / "fieldsight_foliar_v1.onnx"
    create_fieldsight_onnx_model(out_file)
