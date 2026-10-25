# NEXFIELD — Data Flow & Ingestion Lifecycle

**Project:** NEXFIELD — The Agricultural Intelligence Operating System  
**Hackathon:** ADAPPT 5.0 — Round 2 — Domain 2: AI in Food Technology  
**Version:** 2.4.0  
**Authors:** Tanish Bane (@TanishBane) & Rohan Panchal (@panchalrohan44)

---

## 1. End-to-End Data Pipeline Architecture

NEXFIELD processes multi-modal data streams across disparate agricultural domains: IoT soil microclimate sensors, high-resolution foliar RGB imagery, GIS spatial field polygons, and APMC market commodity rates.

```mermaid
flowchart LR
    subgraph Ingestion
        Sensors["IoT Sensors & Weather APIs<br/>(Temperature, VWC, VPD)"]
        Camera["Mobile / Drone RGB Scans<br/>(Leaf Pathology Images)"]
        GIS["Spatial Boundaries<br/>(GeoJSON Field Polygons)"]
        Mandi["APMC Mandi Feeds<br/>(Commodity Rates, Freight)"]
    end

    subgraph Processing ["Processing & Inference (FastAPI)"]
        Pydantic["Pydantic v2 Ingestion Gate<br/>(Contract Validation)"]
        ONNX["ONNX Runtime & CAM<br/>(Pathology Vision)"]
        BioPhys["FAO-56 Soil Water Engine<br/>(Hydrology Balance)"]
        Arbitrage["Haulage Optimizer<br/>(Net Realization Math)"]
    end

    subgraph Storage ["Persistent & Demonstration Storage"]
        LocalStorage["Browser LocalStorage ('nexfield-demo-v1')"]
        PostgreSQL["Optional PostgreSQL 15 (Relational Data)"]
        PostGIS["PostGIS Spatial Indices (GIST)"]
        BlobStore["Object Storage / In-Memory Buffer"]
    end

    subgraph Presentation ["Presentation Tier (Next.js 15)"]
        HUD["Control Center Telemetry HUD"]
        Twin3D["WebGL 3D Digital Twin"]
        DiagnosisView["Pathology CAM Overlay View"]
        MarketView["Arbitrage Comparison Grid"]
    end

    Sensors --> Pydantic
    Camera --> Pydantic
    GIS --> Pydantic
    Mandi --> Pydantic

    Pydantic --> ONNX
    Pydantic --> BioPhys
    Pydantic --> Arbitrage

    ONNX --> BlobStore
    ONNX --> LocalStorage
    BioPhys --> LocalStorage
    Pydantic --> PostGIS

    LocalStorage --> HUD
    PostGIS --> Twin3D
    BlobStore --> DiagnosisView
    Arbitrage --> MarketView
```

---

## 2. Ingestion Lifecycles & Sequence Workflows

### 2.1 FieldSight Visual Pathology Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Farmer (Mobile / Web)
    participant Client as Next.js Client
    participant API as FastAPI Ingestion Endpoint (/api/fieldsight/diagnose)
    participant ONNX as ONNX Runtime (fieldsight_foliar_v1.onnx)
    participant CAM as Conv3 Activation Mapper
    participant Storage as Client Store (localStorage) / DB

    Farmer->>Client: Select or capture leaf image (RGB JPEG/PNG)
    Client->>Client: Client-side dimension & size check (< 10MB)
    Client->>API: POST /api/fieldsight/diagnose (multipart/form-data)
    API->>API: Validate MIME type & decode with OpenCV / PIL
    API->>API: Resize to 224x224 & normalize by ImageNet [mean, std]
    API->>ONNX: Execute inference session (run tensor)
    ONNX-->>API: 5-class logits / softmax probabilities (5.13ms)
    API->>CAM: Extract Conv3 layer activations for dominant class
    CAM->>CAM: Compute weighted spatial activation & upscale to 224x224
    CAM-->>API: Base64-encoded colorized heatmap overlay
    API-->>Client: 200 OK (DiagnosisResult JSON with prescription & CAM)
    Client->>Storage: Persist observation record (disease_class, confidence, severity, CAM)
    Client-->>Farmer: Render diagnosis card, ICAR treatment, and interactive heatmap
```

### 2.2 Biophysical Twin Hydrology & Simulation Cycle

```mermaid
sequenceDiagram
    autonumber
    actor Agronomist as Agronomist / Manager
    participant TwinUI as 3D Digital Twin UI (/twin)
    participant Engine as FastAPI Simulation Engine (/api/twin/simulate)
    participant DB as PostGIS & Telemetry DB

    Agronomist->>TwinUI: Adjust scenario parameters (Irrigation: -20%, Temp: +3°C)
    TwinUI->>Engine: POST /api/twin/simulate (SimulationRequestDTO)
    Engine->>DB: Query field soil properties (Field Capacity, Wilting Point, Depth)
    DB-->>Engine: Soil hydraulic parameters & historical ET0 baseline
    Engine->>Engine: Calculate FAO-56 Reference ET (Penman-Monteith)
    Engine->>Engine: Calculate Crop ET (ETc = Kc * ET0)
    Engine->>Engine: Compute daily rootzone depletion (Dr,i = Dr,i-1 - P + ETc - I)
    Engine->>Engine: Determine yield penalty via Ky response factor: (1 - Ya/Ym) = Ky(1 - ETa/ETc)
    Engine-->>TwinUI: 200 OK (Multi-day moisture trajectory, water saved, yield delta)
    TwinUI->>TwinUI: Re-render WebGL soil shader & counterfactual comparison chart
```

### 2.3 Mandi Market Freight Arbitrage Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Farmer as Farmer
    participant UI as Markets UI (/markets)
    participant Engine as Mandi Arbitrage Engine (/api/markets/arbitrage)
    participant Scraper as Mandi Scraping & Cache Service

    Farmer->>UI: Select commodity: Tomato (Nashik origin, 20 quintals)
    UI->>Engine: POST /api/markets/arbitrage (crop: "Tomato", origin: "Nashik", volume: 20)
    Engine->>Scraper: Query latest modal price for Nashik, Pimpalgaon, Lasalgaon
    Scraper-->>Engine: Commodity rates per quintal & market arrival volumes
    loop For each candidate APMC Mandi
        Engine->>Engine: Lookup road haulage distance (km)
        Engine->>Engine: Calculate freight = (dist * rate_per_km * tons) + loading_surcharge
        Engine->>Engine: Calculate net realization = Mandi_price - freight - cess
        Engine->>Engine: Compute net spread vs local mandi
    end
    Engine-->>UI: Ranked market opportunities sorted by net profit realization
    UI-->>Farmer: Display recommendation banner (+₹280/quintal net gain at Pimpalgaon)
```

---

## 3. Spatial Polygon Handling & PostGIS Pipeline

1. **Polygon Boundary Ingestion:** Farm parcels are submitted as GeoJSON `Feature<Polygon>` structures containing coordinate rings in `EPSG:4326` (WGS 84).
2. **Topology & Validation:**
   - Shapely validates polygon closure, self-intersection, and orientation.
   - Rejects invalid polygons or degenerate geometries.
3. **Database Indexing:**
   - Stored in PostgreSQL using `GEOMETRY(Polygon, 4326)`.
   - Indexed via PostGIS R-Tree Spatial Index (`GIST (geometry_column)`), enabling sub-millisecond point-in-polygon queries and bounding box intersections.
4. **WebGL 3D Rendering Pipeline:**
   - Coordinates are normalized to local Cartesian coordinates $(X, Z)$ centered at the farm centroid.
   - Elevation data is sampled from digital elevation models (DEM) to produce three-dimensional terrain meshes.

---

## 4. Synthetic Fixture Fallback Protocol

When running in offline or local demonstration mode (`NEXT_PUBLIC_USE_FIXTURES=true`):
- All network adapters intercept API requests and serve pre-validated JSON fixtures from `data/fixtures/`.
- Every fixture payload includes the canonical metadata tag: `isFixture: true`.
- Guarantees 100% deterministic UI testing, instant load times, and reproducible evaluation without network reliance.

---

*Document maintained under NEXFIELD Data Systems.*
