# Security Policy

## Supported Versions

| Version | Supported |
| :------ | :-------: |
| 0.1.x   | ✅        |
| < 0.1.0 | ❌        |

---

## Reporting a Vulnerability

If you discover a security vulnerability in DevBrain AI, please **do not open a public GitHub issue**.

Instead, open a [GitHub Security Advisory](https://github.com/devbrain-ai/devbrain-ai/security/advisories/new) to report it privately through GitHub's built-in system.

Please include:
- A description of the vulnerability
- Steps to reproduce it
- Potential impact
- Any suggested fixes (optional)

You can expect a response within **48 hours**. If the vulnerability is confirmed, a fix will be prioritized and released as soon as possible. You will be credited in the release notes unless you prefer to remain anonymous.

---

## API Key Security

DevBrain AI requires an [OpenRouter](https://openrouter.ai) API key to function. Please follow these guidelines to keep your key safe:

- **Never commit your `.env` file.** It is listed in `.gitignore` by default.
- **Never hardcode your API key** in source code or configuration files.
- **Rotate your key immediately** if you suspect it has been exposed. You can manage your keys at [openrouter.ai/keys](https://openrouter.ai/keys).
- If you accidentally commit a key, assume it is compromised. Revoke it and generate a new one — git history is public.

---

## Known Security Considerations

**Command injection**
The `brain doctor` command executes AI-suggested shell commands via `execSync`. DevBrain includes a blocklist for known dangerous patterns (e.g. `rm -rf`, `mkfs`), but you should always **review suggested commands before confirming execution**. Do not run DevBrain with elevated privileges.

**Model output trust**
DevBrain passes AI-generated content to your terminal. The AI can make mistakes or suggest incorrect commands. Treat all output as a suggestion, not a guarantee.

**Branch and file path sanitization**
User-supplied branch names and file paths passed to `git` commands are sanitized to prevent shell injection. If you discover a bypass, please report it privately using the process above.

**Local config file**
DevBrain stores your model preference in `~/.devbrain.json`. This file contains no secrets, but ensure appropriate file permissions on shared systems.

---

## Scope

The following are **in scope** for security reports:

- Command injection vulnerabilities
- API key leakage through logs or output
- Path traversal in file handling
- Any vulnerability that could cause unintended code execution

The following are **out of scope**:

- Vulnerabilities in third-party dependencies (report those upstream)
- Issues requiring physical access to the machine
- Social engineering attacks

---

## Acknowledgements

We appreciate responsible disclosure. Contributors who report valid vulnerabilities will be acknowledged in the project's release notes.
