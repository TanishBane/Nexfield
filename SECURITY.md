# Security Policy

The NEXFIELD maintainers take the security of our agricultural intelligence platform, user data, and farm telemetry seriously.

---

## Supported Versions

Only the latest active major releases receive security updates and vulnerability patches:

| Version | Supported | Notes |
|---|---|---|
| `2.x` | :white_check_mark: | Current active release branch (`main`) |
| `1.x` | :white_check_mark: | Critical security patches only |
| `< 1.0` | :x: | Unsupported prototype releases |

---

## Reporting a Vulnerability

Please **DO NOT** report security vulnerabilities through public GitHub issues, discussions, or pull requests.

### Preferred Method: GitHub Private Vulnerability Reporting
If you have discovered a potential security vulnerability in NEXFIELD:

1. Navigate to the repository's [**Security Advisories tab**](https://github.com/TanishBane/Nexfield/security/advisories).
2. Click [**Report a vulnerability**](https://github.com/TanishBane/Nexfield/security/advisories/new) to open a confidential draft advisory.
3. Provide a clear description including:
   - Affected component(s) (e.g., Next.js middleware, FastAPI endpoints, client store isolation, ONNX runtime).
   - Step-by-step instructions or proof-of-concept script to reproduce the vulnerability.
   - Assessment of potential impact (e.g., unauthorized data access, privilege escalation, denial of service).
   - Any suggested mitigations or patches.

### Handling Process & Timeline
- **Initial Acknowledgement:** The maintainers will acknowledge receipt of your advisory report within **48 hours**.
- **Triage & Assessment:** The issue will be triaged and investigated to determine severity and scope.
- **Collaborative Remediation:** Maintainers will work with the reporter in the private advisory discussion and prepare a patch branch.
- **Coordinated Disclosure:** A patched release will be published along with a public security advisory giving appropriate credit to the reporter (unless anonymity is requested).

---

## Security Architecture & Best Practices

For an architectural breakdown of NEXFIELD's public demo security, client-state sandboxing, strict origin CORS validation, and CVE-2025-29927 Next.js middleware mitigations, please review [`docs/SECURITY.md`](docs/SECURITY.md).
