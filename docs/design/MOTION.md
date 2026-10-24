# MOTION & INTERACTION SPECIFICATION — PROJECT EARTH

**Project:** NEXFIELD — The Agricultural Intelligence Operating System  
**Lead Designer & Architect:** Tanish Bane (@TanishBane)  
**Libraries:** `gsap` v3.15.0, `@gsap/react` v2.1.2  
**Status:** Canonical & Active

---

## 1. Motion Philosophy: The Rhythms of the Land

Agricultural systems operate on deliberate, organic time scales: capillary infiltration through soil, diurnal transpiration cycles, and phenological ripening. NEXFIELD’s motion design reflects these principles:

1. **Purposeful & Informative:**
   Motion is never decorative fluff. Every animation directs the operator's eye to changes in biophysical state (e.g., moisture depletion, disease progression, price arbitrage).
2. **Subtle & Restrained:**
   Displacements are kept under 30px. Elements gently rise into place rather than flying across the screen.
3. **Hardware-Accelerated & Leak-Free:**
   All transforms leverage composite-only properties (`transform: translate3d()` and `opacity`) to ensure solid 60/120 FPS rendering on modern displays.
4. **Absolute Motion Respect (`prefers-reduced-motion`):**
   Users with vestibular disorders or motion sensitivities receive instantaneous, zero-motion transitions.

---

## 2. GSAP & ScrollTrigger Implementation

Motion is orchestrated using the official GreenSock Animation Platform (`gsap`) and its React lifecycle wrapper (`@gsap/react`).

### Clean Lifecycle Scoping:
In `apps/web/app/page.tsx`, animations are bound to a React ref scope:

```tsx
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function CinematicLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const revealElements = containerRef.current?.querySelectorAll('.gsap-reveal');
      revealElements?.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    },
    { scope: containerRef }
  );
  // ...
}
```

### Why `{ scope: containerRef }` is Critical:
In Next.js App Router and React 19, unmanaged GSAP animations create lingering DOM observers and memory leaks during page navigation. `@gsap/react` automatically cleans up all associated ScrollTrigger instances on component unmount.

---

## 3. Timing Scales & Easing Curves

| Interaction Tier | Duration | Easing Curve | CSS / GSAP Expression | Typical Application |
|---|---|---|---|---|
| **Micro-Interaction** | 150ms - 200ms | Fast Out, Slow In | `ease-out` / `power1.out` | Button hover, badge scale, checkbox toggle |
| **Component Reveal** | 300ms - 400ms | Standard Easing | `cubic-bezier(0.16, 1, 0.3, 1)` | Dropdown menus, modal dialogs, drawer expansion |
| **Section Scroll Reveal** | 800ms | Power2 Deceleration | `power2.out` | Feature card entrance, headline stagger on scroll |
| **Hydrological Pulse** | 2000ms | Sinusoidal Infinite | `ease-in-out` | Active drip irrigation status indicator, radar beacon |

---

## 4. Interactive Micro-Interactions

### 1. Grad-CAM Activation Blending
When toggling between raw RGB foliar imagery and Grad-CAM pathology heatmaps:
- The opacity of the activation heatmap transitions smoothly over **350ms** (`transition-opacity duration-350 ease-out`).
- Cross-hair bounding boxes snap into position using a subtle scale-in (`scale-95` to `scale-100`).

### 2. FAO-56 Irrigation Regime Comparison
When switching between *Conventional Scheduled Flood* and *NEXFIELD Precision Drip*:
- Water savings percentages and soil moisture readouts smoothly interpolate without numerical snap.
- Color palettes dynamically morph from warning amber to optimal emerald.

### 3. Mandi Freight Distance Slider
When dragging the harvest volume or distance slider:
- Rupee net realizations recalculate in real time (<16ms frame budget).
- Tabular monospace numbers prevent layout jitter during continuous thumb movement.
