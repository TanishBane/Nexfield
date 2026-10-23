# NEXFIELD — Automated Dependency Management & Dependabot Guide

**Document Purpose:** Specification and operational procedures for automated dependency updates and security auditing across the NEXFIELD monorepo using GitHub Dependabot v2.

---

## 1. Dependabot Architecture

NEXFIELD employs official Dependabot v2 configuration in [`.github/dependabot.yml`](file:///C:/Nexfield/.github/dependabot.yml) with automated grouping to mitigate PR fatigue:

| Ecosystem | Target Directory | Schedule | PR Grouping Strategy | Open PR Limit |
|---|---|---|---|---|
| **`npm`** | `/` (root pnpm monorepo) | Weekly (Mondays 04:00 IST) | Groups all minor & patch updates into `minor-and-patch` | 5 |
| **`pip`** | `/services/api` | Weekly (Mondays 04:30 IST) | Groups all minor & patch updates into `python-minor-and-patch` | 5 |
| **`github-actions`** | `/` | Weekly (Mondays 05:00 IST) | Groups all minor & patch updates into `actions-minor-and-patch` | 5 |

---

## 2. Configuration Highlights

### A. Root pnpm Monorepo Handling
Dependabot inspects the root `package.json`, `pnpm-workspace.yaml`, and `pnpm-lock.yaml`. By setting `directory: "/"`, Dependabot correctly updates packages across `apps/web`, `packages/contracts`, and `packages/ui` while preserving workspace protocol declarations (`workspace:*`).

### B. Pull Request Grouping
Instead of opening individual PRs for every routine dependency release:
- **Minor & Patch Updates:** Batched together into a single weekly pull request per ecosystem.
- **Major Breaking Upgrades:** Isolated into dedicated individual pull requests to ensure thorough human review, migration analysis, and compatibility testing.

### C. Standardized Commit Prefixes
All automated commits follow Conventional Commits:
- `chore(deps): ...` for frontend and shared packages
- `chore(deps-py): ...` for backend Python requirements
- `chore(actions): ...` for GitHub Actions action versions

---

## 3. Human Review & Merge Protocol

1. **Review Automated PRs:** Check that GitHub Actions (`Frontend CI` and `Backend CI`) pass completely.
2. **Never Automatically Merge Major Upgrades:** Major semver bumps (e.g. Next.js 16, Three.js major versions, or Pydantic v3) must be tested on local feature branches before merging.
3. **Keep Lockfiles Consistent:** Never introduce extraneous lockfiles (`package-lock.json`, `yarn.lock`). Always maintain `pnpm-lock.yaml` as the sole package lockfile.
