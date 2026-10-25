---
applyTo: "services/api/**"
---

# NEXFIELD backend instructions

- Respect backend ownership and the collaboration process in `AGENTS.md`.
- Inspect the actual router, schemas, test fixtures and shared TypeScript/Zod contracts before changing endpoint behavior.
- Use FastAPI, Pydantic v2, async patterns and the project's existing error envelope consistently.
- Public stateless endpoints must not rely on a forged public identity or a client-controlled auth header.
- Treat uploaded and remotely referenced image content as untrusted. Preserve SSRF protections, DNS/destination checks, redirect checks, content validation, streaming size limits and timeouts.
- Do not introduce a public path to database-backed private records. Any protected endpoint must retain real authentication and ownership checks.
- Keep numeric methods and model assumptions explicit. A parameterized estimate is not a validated crop forecast; scheduled irrigation volume is not a dynamic FAO-56 root-zone model.
- Do not label fixture or fallback data as live provider output. Keep model and source limitations visible.
- Database, Alembic, schema and migrations are backend-owned. Coordinate any contract changes with the shared architecture owners; never unilaterally alter shared DTOs.
- Add regression tests for security boundaries, errors and numerical behavior. Run `python -m pytest services/api` and report real results.
