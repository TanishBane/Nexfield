# Contributing to NEXFIELD

Thank you for your interest in contributing to **NEXFIELD — The Agricultural Intelligence Operating System**!

NEXFIELD is an open-source platform combining edge computer vision foliar diagnostics, 3D biophysical digital twin simulations, microclimate hydrology, and APMC Mandi market arbitrage. We welcome contributions from developers, agronomists, data scientists, and UI/UX designers.

---

## 1. Code of Conduct & Governance

NEXFIELD adheres to standard open-source community standards. All contributors, maintainers, and community members are expected to interact respectfully, collaboratively, and constructively.

### Team Governance & Directory Ownership
In accordance with [`AGENTS.md`](AGENTS.md), project components follow clear ownership boundaries:
- **Frontend & Product Architecture:** Handled by Tanish Bane ([@TanishBane](https://github.com/TanishBane)) (`apps/web/**`, `packages/ui/**`).
- **Backend & ML Systems Architecture:** Handled by Rohan Panchal ([@panchalrohan44](https://github.com/panchalrohan44)) (`services/api/**`, `ml/**`).
- **Shared Architecture Council:** `packages/contracts/**`, `docs/contracts/**`, `data/fixtures/**`, `.github/workflows/**`. Neither maintainer unilaterally alters schemas without consensus.

---

## 2. Getting Started & Local Development

### Prerequisites
- **Node.js:** `v20.x` or `v22.x` (LTS)
- **pnpm:** `v9.x` (`corepack enable && corepack prepare pnpm@latest --activate`)
- **Python:** `3.11+` or `3.12+` with `pip`
- **Git:** `2.40+`

### Local Workspace Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/TanishBane/Nexfield.git
cd Nexfield

# 2. Install monorepo dependencies
pnpm install

# 3. Setup Python virtual environment
python3 -m venv .venv
source .venv/bin/activate       # On Windows: .\.venv\Scripts\Activate.ps1
pip install -r services/api/requirements.txt

# 4. Configure local environment variables
cp apps/web/.env.example apps/web/.env.local
cp services/api/.env.example services/api/.env

# 5. Launch full-stack development environment
pnpm dev
# Open http://localhost:3000 in your browser
```

For detailed setup walkthroughs, see [`docs/DEVELOPMENT_WORKFLOW.md`](docs/DEVELOPMENT_WORKFLOW.md).

---

## 3. Branching & Commit Conventions

### Branch Naming Conventions
- `feature/<author>-<description>` (e.g., `feature/tanish-crop-chart`)
- `fix/<author>-<description>` (e.g., `fix/rohan-postgis-query`)
- `docs/<description>` (e.g., `docs/update-readme`)
- `chore/<description>` (e.g., `chore/bump-deps`)

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` A new feature for the user
- `fix:` A bug fix
- `docs:` Documentation changes only
- `style:` Formatting, missing semicolons, etc. (no code logic change)
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

---

## 4. Testing Expectations & Quality Gates

Before submitting a pull request, all automated checks must pass locally:

```bash
# 1. Run all backend unit and integration tests (78 tests)
py -m pytest services/api/tests

# 2. Verify strict TypeScript compiler compliance
pnpm type-check

# 3. Run frontend unit tests (Vitest)
pnpm test

# 4. Run system invariant smoke suite (10 assertions)
pnpm test:e2e

# 5. Test production build
pnpm build
```

---

## 5. Pull Request Protocol & Code Review

1. **Target Branch:** All pull requests should target the `main` branch.
2. **Contract Integrity:** If proposing changes to API endpoints, database schemas, or DTOs, update `packages/contracts` and `docs/contracts/API_SPECIFICATION.md` first.
3. **Draft Pull Requests:** If work is in progress, open a Draft PR to gather early design feedback.
4. **CI Verification:** Ensure GitHub Actions (`frontend-ci.yml`, `backend-ci.yml`) pass with zero errors.
5. **Review:** At least one maintainer review is required before merging. Direct force-pushing to `main` is strictly prohibited.

---

## 6. Contribution Licensing

By contributing to NEXFIELD, you agree that your contributions will be licensed under the project's [MIT License](LICENSE). 

All third-party code, assets, or datasets introduced must have compatible permissive open-source licenses and be clearly attributed.
