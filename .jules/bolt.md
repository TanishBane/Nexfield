## 2024-10-26 - React 3D Canvas Re-renders
**Learning:** Destructuring the entire Zustand store (e.g. `const { val1, val2 } = useStore()`) within a frequent-update context like `@react-three/fiber` causes excessive unnecessary component re-renders whenever ANY store state changes.
**Action:** Always use individual atomic state selectors (e.g. `const val = useStore((state) => state.val)`) to ensure components only re-render when the specific state they consume changes.
