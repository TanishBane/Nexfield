## 2024-10-24 - [Form Accessibility Defaults]
**Learning:** Found that custom forms constructed in the repository often use generic block labels without proper `<label htmlFor="...">` and `<input id="...">` bindings, breaking screen reader association and click-to-focus behavior.
**Action:** Always ensure that `htmlFor` and `id` properties are tightly coupled on all custom input arrays in Nexfield modals to guarantee a11y compliance.

## 2026-10-26 - Missing explicit labels in forms with only placeholders
**Learning:** Forms designed primarily with placeholder text but without explicit `<label>` elements lack sufficient screen reader accessibility.
**Action:** When explicit labels are omitted for visual design reasons (e.g., in a compact drawer or quick-add form), ensure to add `aria-label` attributes to `<input>`, `<select>`, and other interactive fields.
