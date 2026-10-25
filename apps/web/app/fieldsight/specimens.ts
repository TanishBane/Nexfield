/**
 * NEXFIELD 2.0 — FieldSight AI Photographic Specimen Gallery & Ground Truth Data
 * High-fidelity vector-raster photographic macros and Grad-CAM saliency activation overlays.
 * Aligned with ICAR (Indian Council of Agricultural Research) diagnostic protocols.
 */

// Helper to convert SVG strings to data URIs
function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export interface Specimen {
  id: string;
  name: string;
  crop: string;
  variety: string;
  conditionName: string;
  pathogen: string;
  confidenceScore: number;
  severityLevel: 'critical' | 'moderate' | 'optimal' | 'warning';
  affectedAreaPercentage: number;
  originalImage: string;
  heatmapImage: string;
  symptoms: string[];
  chemicalInterventions: string[];
  biologicalInterventions: string[];
  withholdingPeriodDays: number;
  rationale: string;
  icarProtocolCode: string;
}

// 1. Tomato Early Blight (Alternaria solani) - Concentric target-like necrotic rings
const TOMATO_EARLY_BLIGHT_RAW = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="leafGrad" cx="45%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#2D5A27" />
      <stop offset="40%" stop-color="#1E3F1A" />
      <stop offset="85%" stop-color="#142C12" />
      <stop offset="100%" stop-color="#0A1609" />
    </radialGradient>
    <radialGradient id="haloGrad1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="60%" stop-color="#B45309" />
      <stop offset="85%" stop-color="#854D0E" />
      <stop offset="100%" stop-color="#1E3F1A" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="necrosisGrad1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#291A10" />
      <stop offset="40%" stop-color="#451A03" />
      <stop offset="70%" stop-color="#78350F" />
      <stop offset="90%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#D97706" />
    </radialGradient>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.15 0" />
      <feComposite in2="SourceGraphic" in="gl" operator="in" />
    </filter>
  </defs>

  <!-- Background Soil/Canopy Blur -->
  <rect width="800" height="600" fill="#0C150F" />

  <!-- Solanaceous Leaf Blade -->
  <path d="M400,30 C560,70 720,200 690,420 C660,520 540,570 400,580 C260,570 140,520 110,420 C80,200 240,70 400,30 Z" fill="url(#leafGrad)" />

  <!-- Botanical Vein Network -->
  <path d="M400,30 Q400,300 400,580" stroke="#487841" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6" />
  <path d="M400,120 Q500,180 620,220" stroke="#3D6837" stroke-width="3" fill="none" opacity="0.5" />
  <path d="M400,200 Q280,260 180,310" stroke="#3D6837" stroke-width="3" fill="none" opacity="0.5" />
  <path d="M400,300 Q520,350 630,410" stroke="#3D6837" stroke-width="3" fill="none" opacity="0.5" />
  <path d="M400,400 Q290,440 200,490" stroke="#3D6837" stroke-width="3" fill="none" opacity="0.5" />

  <!-- Primary Concentric Lesion Spot (Alternaria Solani Target Board) -->
  <circle cx="340" cy="270" r="95" fill="url(#haloGrad1)" opacity="0.85" />
  <circle cx="340" cy="270" r="70" fill="url(#necrosisGrad1)" />
  <circle cx="340" cy="270" r="54" fill="none" stroke="#291A10" stroke-width="4" opacity="0.9" />
  <circle cx="340" cy="270" r="38" fill="none" stroke="#451A03" stroke-width="5" opacity="0.9" />
  <circle cx="340" cy="270" r="22" fill="none" stroke="#291A10" stroke-width="4" opacity="0.95" />
  <circle cx="340" cy="270" r="10" fill="#1C1008" />

  <!-- Secondary Satellite Lesions -->
  <circle cx="480" cy="380" r="55" fill="url(#haloGrad1)" opacity="0.8" />
  <circle cx="480" cy="380" r="40" fill="url(#necrosisGrad1)" />
  <circle cx="480" cy="380" r="28" fill="none" stroke="#291A10" stroke-width="3" opacity="0.9" />
  <circle cx="480" cy="380" r="14" fill="#1C1008" />

  <circle cx="260" cy="410" r="35" fill="url(#haloGrad1)" opacity="0.75" />
  <circle cx="260" cy="410" r="24" fill="url(#necrosisGrad1)" />
  <circle cx="260" cy="410" r="10" fill="#1C1008" />

  <!-- Macro Reticle Overlay -->
  <rect x="220" y="150" width="240" height="240" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="8 6" opacity="0.8" />
  <text x="230" y="175" fill="#FDE68A" font-family="monospace" font-size="14" font-weight="bold">TARGET: Alternaria solani</text>
  <text x="230" y="195" fill="#FDE68A" font-family="monospace" font-size="12">Concentric Rings Conf: 96.4%</text>
</svg>
`;

const TOMATO_EARLY_BLIGHT_CAM = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="camPeak1" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#EF4444" stop-opacity="0.95" />
      <stop offset="35%" stop-color="#F97316" stop-opacity="0.85" />
      <stop offset="65%" stop-color="#EAB308" stop-opacity="0.7" />
      <stop offset="85%" stop-color="#10B981" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#064E3B" stop-opacity="0.05" />
    </radialGradient>
    <radialGradient id="camPeak2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#DC2626" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#EA580C" stop-opacity="0.8" />
      <stop offset="75%" stop-color="#CA8A04" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#065F46" stop-opacity="0.05" />
    </radialGradient>
  </defs>

  <!-- Cool Saliency Baseline -->
  <rect width="800" height="600" fill="#042F2E" opacity="0.7" />

  <!-- Neural Activation Peaks at Lesion Centers -->
  <circle cx="340" cy="270" r="160" fill="url(#camPeak1)" />
  <circle cx="480" cy="380" r="120" fill="url(#camPeak2)" />
  <circle cx="260" cy="410" r="90" fill="url(#camPeak2)" opacity="0.8" />

  <!-- Heatmap HUD Legend -->
  <rect x="24" y="24" width="220" height="58" rx="8" fill="#090D0B" fill-opacity="0.85" stroke="#10B981" stroke-width="1" />
  <text x="36" y="46" fill="#F1F6F3" font-family="monospace" font-size="12" font-weight="bold">Grad-CAM Activation</text>
  <text x="36" y="66" fill="#10B981" font-family="monospace" font-size="11">Peak Saliency: Layer conv5_3</text>
</svg>
`;

// 2. Wheat Stripe Rust (Puccinia striiformis) - Linear parallel uredinial pustules
const WHEAT_STRIPE_RUST_RAW = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="wheatBlade" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#345E2A" />
      <stop offset="45%" stop-color="#284B20" />
      <stop offset="80%" stop-color="#1D3617" />
      <stop offset="100%" stop-color="#11220E" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="#0C150F" />

  <!-- Wheat Flag Leaf Blade (Elongated) -->
  <path d="M120,500 L240,40 C360,10 440,20 540,80 L700,550 C620,580 220,560 120,500 Z" fill="url(#wheatBlade)" />

  <!-- Parallel Leaf Venation Lines -->
  <line x1="260" y1="50" x2="680" y2="520" stroke="#487841" stroke-width="2" opacity="0.5" />
  <line x1="280" y1="50" x2="660" y2="530" stroke="#487841" stroke-width="2" opacity="0.5" />
  <line x1="300" y1="50" x2="640" y2="540" stroke="#487841" stroke-width="2" opacity="0.5" />
  <line x1="320" y1="50" x2="620" y2="550" stroke="#487841" stroke-width="2" opacity="0.5" />
  <line x1="340" y1="50" x2="600" y2="560" stroke="#487841" stroke-width="2" opacity="0.5" />

  <!-- Linear Parallel Orange Pustule Stripes (Puccinia striiformis) -->
  <!-- Stripe 1 -->
  <rect x="360" y="160" width="12" height="180" rx="6" fill="#F59E0B" transform="rotate(32 360 160)" />
  <rect x="362" y="170" width="8" height="160" rx="4" fill="#D97706" transform="rotate(32 360 160)" />
  <!-- Stripe 2 -->
  <rect x="400" y="190" width="14" height="220" rx="7" fill="#F59E0B" transform="rotate(32 400 190)" />
  <rect x="403" y="200" width="8" height="200" rx="4" fill="#B45309" transform="rotate(32 400 190)" />
  <!-- Stripe 3 -->
  <rect x="440" y="230" width="10" height="190" rx="5" fill="#F59E0B" transform="rotate(32 440 230)" />
  <!-- Stripe 4 -->
  <rect x="320" y="210" width="12" height="140" rx="6" fill="#F59E0B" transform="rotate(32 320 210)" />

  <!-- Yellow Chlorotic Halo Strips -->
  <rect x="390" y="180" width="34" height="240" rx="17" fill="#FEF08A" opacity="0.3" transform="rotate(32 400 190)" />

  <!-- Reticle -->
  <rect x="290" y="160" width="220" height="250" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="6 6" />
  <text x="300" y="185" fill="#FDE68A" font-family="monospace" font-size="13" font-weight="bold">PATHOGEN: Puccinia striiformis</text>
  <text x="300" y="205" fill="#FDE68A" font-family="monospace" font-size="11">Linear Uredinial Rows (95.4%)</text>
</svg>
`;

const WHEAT_STRIPE_RUST_CAM = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="stripeHeat" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0" />
      <stop offset="30%" stop-color="#EAB308" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#EF4444" stop-opacity="0.95" />
      <stop offset="70%" stop-color="#EAB308" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#10B981" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="#042F2E" opacity="0.75" />

  <!-- Linear Heat Bands Matching Uredinial Vein Axis -->
  <rect x="330" y="150" width="60" height="260" rx="30" fill="url(#stripeHeat)" transform="rotate(32 360 160)" />
  <rect x="370" y="180" width="70" height="290" rx="35" fill="url(#stripeHeat)" transform="rotate(32 400 190)" />
  <rect x="410" y="220" width="60" height="250" rx="30" fill="url(#stripeHeat)" transform="rotate(32 440 230)" />

  <rect x="24" y="24" width="220" height="58" rx="8" fill="#090D0B" fill-opacity="0.85" stroke="#10B981" stroke-width="1" />
  <text x="36" y="46" fill="#F1F6F3" font-family="monospace" font-size="12" font-weight="bold">Grad-CAM Activation</text>
  <text x="36" y="66" fill="#F59E0B" font-family="monospace" font-size="11">Parallel Vein Saliency Aligned</text>
</svg>
`;

// 3. Potato Late Blight (Phytophthora infestans) - Water-soaked spreading lesions
const POTATO_LATE_BLIGHT_RAW = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="leafGrad3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2D5523" />
      <stop offset="70%" stop-color="#1B3814" />
      <stop offset="100%" stop-color="#0E1E0B" />
    </radialGradient>
    <radialGradient id="waterSoaked" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#171C15" />
      <stop offset="50%" stop-color="#2B2D1F" />
      <stop offset="80%" stop-color="#4B4E2E" />
      <stop offset="100%" stop-color="#2D5523" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="800" height="600" fill="#0C150F" />

  <!-- Ovate Potato Leaflet -->
  <path d="M400,60 C580,90 700,240 670,440 C640,530 520,560 400,560 C280,560 160,530 130,440 C100,240 220,90 400,60 Z" fill="url(#leafGrad3)" />

  <!-- Spreading Water-soaked Brown Lesion (Margin-less) -->
  <path d="M440,140 C560,180 620,280 580,380 C540,430 460,400 420,340 C380,280 360,200 440,140 Z" fill="url(#waterSoaked)" />
  <path d="M460,170 C530,200 570,270 540,340 C510,380 460,360 430,310 C400,260 410,210 460,170 Z" fill="#1C140D" />

  <!-- White Sporulation Mildew Fringe on Margins -->
  <path d="M570,250 Q600,310 560,370" stroke="#F1F5F9" stroke-width="4" stroke-dasharray="3 3" fill="none" opacity="0.8" />
  <path d="M450,380 Q510,410 550,370" stroke="#F1F5F9" stroke-width="3" stroke-dasharray="2 3" fill="none" opacity="0.8" />

  <rect x="360" y="130" width="260" height="280" fill="none" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="6 6" />
  <text x="375" y="155" fill="#FCA5A5" font-family="monospace" font-size="13" font-weight="bold">OOMYCETE: Phytophthora</text>
  <text x="375" y="175" fill="#FCA5A5" font-family="monospace" font-size="11">Water-Soaked Necrosis (97.8%)</text>
</svg>
`;

const POTATO_LATE_BLIGHT_CAM = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="camPeak3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#DC2626" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#EA580C" stop-opacity="0.85" />
      <stop offset="70%" stop-color="#FACC15" stop-opacity="0.6" />
      <stop offset="90%" stop-color="#059669" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#042F2E" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="800" height="600" fill="#042F2E" opacity="0.75" />
  <circle cx="500" cy="280" r="170" fill="url(#camPeak3)" />

  <rect x="24" y="24" width="220" height="58" rx="8" fill="#090D0B" fill-opacity="0.85" stroke="#10B981" stroke-width="1" />
  <text x="36" y="46" fill="#F1F6F3" font-family="monospace" font-size="12" font-weight="bold">Grad-CAM Activation</text>
  <text x="36" y="66" fill="#EF4444" font-family="monospace" font-size="11">Active Sporulation Fringe Peak</text>
</svg>
`;

// 4. Healthy Flag Leaf - Uniform vibrant emerald cuticle with zero necrosis
const HEALTHY_LEAF_RAW = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="healthyCuticle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22C55E" />
      <stop offset="35%" stop-color="#16A34A" />
      <stop offset="70%" stop-color="#15803D" />
      <stop offset="100%" stop-color="#14532D" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="#0C150F" />

  <path d="M400,40 C560,80 680,220 650,440 C620,530 520,570 400,570 C280,570 180,530 150,440 C120,220 240,80 400,40 Z" fill="url(#healthyCuticle)" />

  <!-- Vigorous Symmetrical Veins -->
  <path d="M400,40 Q400,300 400,570" stroke="#86EFAC" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.7" />
  <path d="M400,140 Q490,190 590,240" stroke="#4ADE80" stroke-width="2.5" fill="none" opacity="0.6" />
  <path d="M400,230 Q300,280 210,330" stroke="#4ADE80" stroke-width="2.5" fill="none" opacity="0.6" />
  <path d="M400,320 Q500,370 600,420" stroke="#4ADE80" stroke-width="2.5" fill="none" opacity="0.6" />

  <!-- Wax Layer Sheen Highlights -->
  <ellipse cx="370" cy="220" rx="40" ry="120" fill="#BBF7D0" opacity="0.15" transform="rotate(-15 370 220)" />

  <rect x="250" y="160" width="300" height="280" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="6 6" />
  <text x="270" y="190" fill="#A7F3D0" font-family="monospace" font-size="13" font-weight="bold">HEALTHY CANOPY: Optimal Vigour</text>
  <text x="270" y="210" fill="#A7F3D0" font-family="monospace" font-size="11">Zero Lesions · Asymptomatic (99.2%)</text>
</svg>
`;

const HEALTHY_LEAF_CAM = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#042F2E" opacity="0.6" />
  <!-- Diffuse Baseline Activation (No concentrated peaks) -->
  <circle cx="400" cy="300" r="220" fill="#10B981" fill-opacity="0.18" />

  <rect x="24" y="24" width="220" height="58" rx="8" fill="#090D0B" fill-opacity="0.85" stroke="#10B981" stroke-width="1" />
  <text x="36" y="46" fill="#F1F6F3" font-family="monospace" font-size="12" font-weight="bold">Grad-CAM Activation</text>
  <text x="36" y="66" fill="#10B981" font-family="monospace" font-size="11">Uniform Diffuse Cuticle Saliency</text>
</svg>
`;

export const SPECIMEN_GALLERY: Specimen[] = [
  {
    id: 'specimen-tomato-early-blight',
    name: 'Tomato Early Blight Specimen',
    crop: 'Tomato',
    variety: 'Abhinav F1 Semi-Determinate',
    conditionName: 'Early Blight (Alternaria solani)',
    pathogen: 'Alternaria solani Sorauer (Fungi / Ascomycota)',
    confidenceScore: 0.964,
    severityLevel: 'moderate',
    affectedAreaPercentage: 14.2,
    originalImage: svgToDataUri(TOMATO_EARLY_BLIGHT_RAW),
    heatmapImage: svgToDataUri(TOMATO_EARLY_BLIGHT_CAM),
    symptoms: [
      'Concentric target-like circular necrotic brown rings on lower leaves',
      'Chlorotic yellow halos surrounding expanding necrotic lesions',
      'Stem collar lesions and early lower canopy senescence',
    ],
    chemicalInterventions: [
      'Mancozeb 75 WP @ 2.5 g/L water (uniform foliar spray covering lower canopy)',
      'Alternate with Azoxystrobin 23 SC @ 1.0 ml/L water after 10-12 days',
      'Withhold chemical spray 7 days prior to commercial harvest',
    ],
    biologicalInterventions: [
      'Trichoderma harzianum @ 5 g/L foliar wash during early vegetative stages',
      'Neem seed kernel extract (NSKE 5%) spray at first appearance of lesions',
    ],
    withholdingPeriodDays: 7,
    rationale:
      'High ambient relative humidity (>85% for 6h) with moderate canopy temperature (24-28°C) provides optimal microclimate for Alternaria solani spore germination and penetration.',
    icarProtocolCode: 'ICAR-CP-TOM-EB-04',
  },
  {
    id: 'specimen-wheat-stripe-rust',
    name: 'Wheat Stripe Rust Specimen',
    crop: 'Wheat',
    variety: 'PBW-725 / HD-3086',
    conditionName: 'Stripe Rust (Yellow Rust / Puccinia striiformis)',
    pathogen: 'Puccinia striiformis f. sp. tritici (Fungi / Basidiomycota)',
    confidenceScore: 0.954,
    severityLevel: 'moderate',
    affectedAreaPercentage: 16.8,
    originalImage: svgToDataUri(WHEAT_STRIPE_RUST_RAW),
    heatmapImage: svgToDataUri(WHEAT_STRIPE_RUST_CAM),
    symptoms: [
      'Linear bright yellow-orange uredinial pustules arranged parallel along leaf veins',
      'Premature chlorosis and drying of the photosynthetic flag leaf',
      'Dusty orange spore powder adhering to farm scouting clothing',
    ],
    chemicalInterventions: [
      'Propiconazole 25% EC (Tilt) @ 0.1% (500 ml/ha in 500 L water)',
      'Alternate with Tebuconazole 25.9% EC @ 625 ml/ha if conditions remain cool & humid',
    ],
    biologicalInterventions: [
      'Bacillus subtilis bio-fungicide @ 2.5 kg/ha applied at first dew window',
    ],
    withholdingPeriodDays: 14,
    rationale:
      'Indo-Gangetic northern westerlies carrying airborne spores from sub-Himalayan foothills trigger rapid stripe rust focus development under canopy dew.',
    icarProtocolCode: 'ICAR-WHEAT-YR-11',
  },
  {
    id: 'specimen-potato-late-blight',
    name: 'Potato Late Blight Specimen',
    crop: 'Potato',
    variety: 'Kufri Jyoti',
    conditionName: 'Late Blight (Phytophthora infestans)',
    pathogen: 'Phytophthora infestans (Mont.) de Bary (Oomycota)',
    confidenceScore: 0.978,
    severityLevel: 'critical',
    affectedAreaPercentage: 24.5,
    originalImage: svgToDataUri(POTATO_LATE_BLIGHT_RAW),
    heatmapImage: svgToDataUri(POTATO_LATE_BLIGHT_CAM),
    symptoms: [
      'Water-soaked dark brown irregular necrotic lesions rapidly spreading from margins',
      'White cottony mildew sporulation visible on the leaf underside in morning dew',
      'Foul decaying odor associated with severe tuber and foliage necrosis',
    ],
    chemicalInterventions: [
      'Cymoxanil 8% + Mancozeb 64% WP @ 3.0 g/L foliar spray immediately',
      'Dimethomorph 50% WP @ 1.0 g/L in rotational schedule after 7 days',
    ],
    biologicalInterventions: [
      'Pseudomonas fluorescens 1% WP @ 2.5 kg/ha soil and foliar drench',
    ],
    withholdingPeriodDays: 10,
    rationale:
      'Relative humidity exceeding 90% with night temperatures of 10-14°C and daytime 18-22°C creates classic late blight epidemic conditions.',
    icarProtocolCode: 'ICAR-POT-LB-02',
  },
  {
    id: 'specimen-healthy-leaf',
    name: 'Healthy Asymptomatic Flag Leaf',
    crop: 'Multi-Crop',
    variety: 'Healthy Cuticle Baseline',
    conditionName: 'Healthy Asymptomatic Foliage',
    pathogen: 'None (Optimal Plant Physiological State)',
    confidenceScore: 0.992,
    severityLevel: 'optimal',
    affectedAreaPercentage: 0.0,
    originalImage: svgToDataUri(HEALTHY_LEAF_RAW),
    heatmapImage: svgToDataUri(HEALTHY_LEAF_CAM),
    symptoms: [
      'Uniform dark emerald green leaf blade with intact wax cuticle',
      'Well-developed vascular veins with active transpiration turgor',
      'Absence of fungal pustules, bacterial water-soaking, or pest puncture scars',
    ],
    chemicalInterventions: [
      'No synthetic fungicides required. Withhold all chemical interventions.',
    ],
    biologicalInterventions: [
      'Maintain prophylactic silicon-based foliar biostimulant @ 2 ml/L to reinforce cuticle thickness.',
    ],
    withholdingPeriodDays: 0,
    rationale:
      'Balanced soil rootzone moisture (41.4% VWC) and optimal nitrogen levels support high chlorophyll index and natural systemic acquired resistance (SAR).',
    icarProtocolCode: 'ICAR-HEALTHY-01',
  },
];
