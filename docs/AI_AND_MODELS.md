# NEXFIELD — AI & Biophysical Modeling Specification

**Project:** NEXFIELD — The Agricultural Intelligence Operating System  
**Hackathon:** ADAPPT 5.0 — Round 2 — Domain 2: AI in Food Technology  
**Version:** 2.4.0  
**Lead ML Architect:** Rohan Panchal (@panchalrohan44)  
**Product Lead:** Tanish Bane (@TanishBane)

---

## 1. Scientific Integrity & Capability Demarcation

In mission-critical agricultural and food applications, algorithmic transparency is paramount. NEXFIELD strictly differentiates between:
- **Calibrated Machine Learning:** Fast edge/server neural inference (ONNX Runtime) with spatial explainability.
- **Biophysical Deterministic Physics:** Standardized international agronomic conservation equations (FAO-56).
- **Domain Heuristics:** Empirical extension packages of practices (ICAR, FAO Bulletin 149).

> [!NOTE]
> **Model Calibration Disclaimer:**  
> The FieldSight neural network weights in `ml/models/fieldsight_foliar_v1.onnx` are calibrated on synthetic foliar lesion signatures for high-speed edge demonstration (5.13 ms CPU execution). Clinical-grade multi-season field validation trials are planned in partnership with state agricultural universities (SAUs) for commercial production deployment.

---

## 2. Model 1: FieldSight Foliar Pathology Engine

### 2.1 Model Topology & Architecture
- **Backbone Architecture:** MobileNetV3-Small featuring Depthwise Separable Convolutions and Squeeze-and-Excitation (SE) attention blocks.
- **Execution Target:** CPU Edge / Server inference via ONNX Runtime (`fieldsight_foliar_v1.onnx`).
- **Inference Latency:** **$5.13\text{ ms}$** on standard single-core x86 CPU.
- **Input Specification:**
  $$\mathbf{X} \in \mathbb{R}^{1 \times 3 \times 224 \times 224}$$
  Normalized with ImageNet statistics: $\mu = [0.485, 0.456, 0.406]$, $\sigma = [0.229, 0.224, 0.225]$.
- **Output Specification:**
  $$\mathbf{\hat{y}} = \text{Softmax}(\mathbf{z}) \in \mathbb{R}^{5}, \quad \sum_{k=1}^5 \hat{y}_k = 1.0$$
  Target Classes:
  1. `early_blight` (*Alternaria solani*)
  2. `late_blight` (*Phytophthora infestans*)
  3. `septoria_leaf_spot` (*Septoria lycopersici*)
  4. `yellow_leaf_curl` (Geminiviridae)
  5. `healthy`

### 2.2 Spatial Class Activation Mapping (CAM) Mathematics

To explain predictions visually to farmers, FieldSight computes a spatial Class Activation Map from the final convolutional layer ($\text{Conv3}$):

$$M_c(x, y) = \sum_{k} w_k^c f_k(x, y)$$

Where:
- $f_k(x, y)$ represents the activation of feature map $k$ in layer $\text{Conv3}$ at spatial location $(x, y)$.
- $w_k^c$ is the classification weight connecting channel $k$ to the predicted disease class $c$.

The raw heatmap $M_c$ is normalized via min-max scaling and upscaled via bilinear interpolation to match the original $224 \times 224$ image coordinates:

$$H_c(x, y) = \frac{M_c(x, y) - \min(M_c)}{\max(M_c) - \min(M_c)}$$

The normalized heatmap is color-mapped (Jet/Turbo colormap) and composited over the RGB image, highlighting infected necrosis lesions in red/amber.

---

## 3. Model 2: Biophysical Digital Twin Simulator (FAO-56)

### 3.1 Reference Evapotranspiration ($ET_o$) — Penman-Monteith Equation

NEXFIELD calculates atmospheric evaporative demand using the full FAO-56 Penman-Monteith physical equation (Allen et al., 1998):

$$ET_o = \frac{0.408 \Delta (R_n - G) + \gamma \frac{900}{T + 273} u_2 (e_s - e_a)}{\Delta + \gamma (1 + 0.34 u_2)}$$

Where:
- $ET_o$: Reference evapotranspiration [$\text{mm}\cdot\text{day}^{-1}$]
- $R_n$: Net radiation at the crop surface [$\text{MJ}\cdot\text{m}^{-2}\cdot\text{day}^{-1}$]
- $G$: Soil heat flux density [$\text{MJ}\cdot\text{m}^{-2}\cdot\text{day}^{-1}$]
- $T$: Mean daily air temperature at $2\text{ m}$ height [$^\circ\text{C}$]
- $u_2$: Wind speed at $2\text{ m}$ height [$\text{m}\cdot\text{s}^{-1}$]
- $e_s$: Saturation vapour pressure [$\text{kPa}$]
- $e_a$: Actual vapour pressure [$\text{kPa}$] ($e_s - e_a$ = vapour pressure deficit, VPD)
- $\Delta$: Slope of the vapour pressure curve [$\text{kPa}\cdot^\circ\text{C}^{-1}$]
- $\gamma$: Psychrometric constant [$\text{kPa}\cdot^\circ\text{C}^{-1}$]

### 3.2 Crop Evapotranspiration & Rootzone Soil Water Balance

Crop water requirement under non-stress conditions:
$$ET_c = K_c \times ET_o$$

Where $K_c$ is the growth-stage specific crop coefficient (Initial: 0.60, Mid-Season: 1.15, End-Season: 0.80 for Solanaceae).

Daily rootzone soil water depletion balance:
$$D_{r,i} = D_{r,i-1} - (P_i - RO_i) - I_i - CR_i + ET_{c,i} + DP_i$$

Where:
- $D_{r,i}$: Rootzone depletion at the end of day $i$ [$\text{mm}$]
- $P_i$: Precipitation [$\text{mm}$]
- $RO_i$: Runoff from soil surface [$\text{mm}$]
- $I_i$: Net irrigation depth applied [$\text{mm}$]
- $CR_i$: Capillary rise from groundwater [$\text{mm}$]
- $ET_{c,i}$: Crop evapotranspiration [$\text{mm}$]
- $DP_i$: Deep percolation loss beyond the rootzone [$\text{mm}$]

### 3.3 Yield Response Factor ($K_y$) for Deficit Irrigation

When soil moisture drops below readily available water ($RAW = p \times TAW$), actual evapotranspiration $ET_a < ET_c$. The relative yield reduction is computed according to the empirical FAO yield response equation:

$$\left(1 - \frac{Y_a}{Y_m}\right) = K_y \left(1 - \frac{ET_a}{ET_c}\right)$$

Where:
- $Y_a$: Actual harvested yield [$\text{tons}\cdot\text{ha}^{-1}$]
- $Y_m$: Maximum theoretical potential yield [$\text{tons}\cdot\text{ha}^{-1}$]
- $K_y$: Yield response factor ($K_y = 1.05$ for tomato during flowering/fruit development).

---

## 4. Model 3: Mandi Market Haulage & Arbitrage Engine

### 4.1 Net Realization Calculation

Given an origin farm location $O$ and candidate regional APMC Mandis $M_j$:

$$P_{\text{net}, j} = P_{\text{mandi}, j} - C_{\text{freight}}(d_j, V) - C_{\text{cess}}(P_{\text{mandi}, j}) - C_{\text{handling}}$$

Where:
- $P_{\text{mandi}, j}$: Modal wholesale commodity price at mandi $j$ [$\text{₹}/\text{quintal}$]
- $d_j$: Road haulage distance from farm to mandi $j$ [$\text{km}$]
- $V$: Crop shipment volume [$\text{metric tons}$]
- $C_{\text{freight}}(d_j, V) = \frac{(d_j \times r_{\text{km}} \times V) + F_{\text{loading}}}{V \times 10}$ [$\text{₹}/\text{quintal}$]
- $C_{\text{cess}}$: Mandi market statutory commission (typically $1.5\% - 2.5\%$)
- $C_{\text{handling}}$: Unloading and weighing charges [$\text{₹}/\text{quintal}$]

The arbitrage spread relative to the local benchmark mandi $M_0$:
$$\Delta \text{Spread}_j = P_{\text{net}, j} - P_{\text{net}, 0}$$

If $\Delta \text{Spread}_j > 0$, transporting produce to distant Mandi $j$ is economically advantageous.

---

## 5. Model 4: Post-Harvest Spoilage Risk Engine (Domain 2 Focus)

To mitigate agricultural food loss, the post-harvest engine calculates a composite Spoilage Risk Index ($SRI \in [0, 100]$) based on storage environmental telemetry:

$$SRI = w_T \cdot f_T(T_{\text{storage}}) + w_H \cdot f_H(RH_{\text{storage}}) + w_M \cdot f_M(M_{\text{crop}})$$

### Threshold Bounds:
- **Tomato Cold Storage:** If $T < 10^\circ\text{C}$, trigger **Chilling Injury Alert** (cellular membrane collapse, water-soaked lesions, fail to turn red).
- **Wheat Grain Silo:** If $M_{\text{grain}} > 14.0\%$, trigger **Mold & Mycotoxin Hazard** (Aflatoxin risk, seed viability loss).
- **Rice Milling Silo:** If $\Delta RH_{\text{ambient}} > 20\%$ within $6\text{ hours}$, trigger **Kernel Fissuring Warning** (head rice yield drop $> 12\%$).

---

*Document maintained under NEXFIELD Applied Machine Learning.*
