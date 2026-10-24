## 2024-10-24 - [Form Accessibility Defaults]
**Learning:** Found that custom forms constructed in the repository often use generic block labels without proper `<label htmlFor="...">` and `<input id="...">` bindings, breaking screen reader association and click-to-focus behavior.
**Action:** Always ensure that `htmlFor` and `id` properties are tightly coupled on all custom input arrays in Nexfield modals to guarantee a11y compliance.
