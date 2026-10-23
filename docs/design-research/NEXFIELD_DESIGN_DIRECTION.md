# NEXFIELD Design Direction

## Vision
A premium, modern, futuristic agricultural intelligence identity. NEXFIELD feels like sophisticated technology used to manage real-world agricultural operations—drawing inspiration from enterprise command centers, high-end geospatial intelligence, precision agriculture, and advanced scientific visualizations.

## Visual Identity
Derived strictly from the established `packages/ui/src/tokens.ts`:

- **Primary Background (Obsidian Dark Field):** `#090D0B`
- **Secondary Surfaces (Card Surface):** `#111714`
- **Elevated Surfaces (Dropdown/Popover):** `#16201B`
- **Accent (Emerald Core):** `#10B981`

### Semantic Accents
- **Hydrology (Sky Blue):** `#38BDF8` text, `#0C2333` bg
- **Harvest (Amber):** `#F59E0B` text, `#2E220D` bg
- **Disease (Rose/Warning):** `#FB7185` text, `#2A1116` bg
- **General Warning (Yellow):** `#FBBF24` text, `#2B210B` bg
- **Spectral/Analysis (Purple):** `#C084FC` text, `#231536` bg

## Typography
- **Primary:** Precise, minimal, highly legible sans-serif (Inter/system-ui).
- **Numerics:** Must use `tabular-nums` for all telemetry, prices, and spatial coordinates.
- **Hierarchy:** Strong contrast between headings (APCA Lc > 90, `#F0F5F2`) and secondary/meta text (`#9BB1A4`).

## Layout System
- **Sidebar:** Persistent, icon-led collapsed state available, containing the 6 core modules.
- **Header:** Clear contextual information, active farm selector, and global status.
- **Data Panels:** Modular, distinct cards with consistent padding and nested radii (`child radius = parent radius - padding`).
- **Charts:** Clean containers without excessive borders; utilizing the semantic color palette.

## Design Principles
1. **Sophisticated rather than flashy:** Avoid generic AI gradients and excessive glassmorphism.
2. **Highly functional:** Every component must serve a data or action purpose. No decorative, non-functional UI.
3. **Consistent:** Across all 6 modules, using identical table, chart, and card structures.
4. **Accessible:** Adhere to APCA contrast requirements and provide clear focus states.
5. **Data-rich:** Handle high density elegantly through careful use of negative space.
6. **Restrained Animation:** Smooth transitions on layout changes, avoid constant background motion.
7. **Transparent State:** Visually distinguish between live telemetry, ML predictions, and digital twin simulated outcomes.
