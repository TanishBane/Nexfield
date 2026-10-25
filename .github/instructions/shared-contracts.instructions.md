---
applyTo: "packages/contracts/**, docs/contracts/**, data/fixtures/**"
---

# NEXFIELD shared contracts and fixtures instructions

- These paths are shared ownership areas. Follow the explicit coordination rules in `AGENTS.md` before changing contract shape, enum values, field names or fixture semantics.
- Keep frontend Zod/TypeScript contracts and backend Pydantic DTOs aligned; update API specifications and relevant tests in the same change.
- Use explicit units, bounded values, meaningful enums and consistent optional/null behavior.
- Fixtures must be clearly synthetic and carry the project's fixture provenance convention where applicable. Do not manufacture live sensor feeds, real market observations, model accuracy scores or real farm outcomes.
- Validate fixture changes against consumers and tests in both the web and API packages.
- Do not introduce real personal or secret data into fixture files.
