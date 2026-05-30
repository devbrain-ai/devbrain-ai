
Markdown
# 🚀 Core Feature: `brain commit`

Deeply analyzes your local Git staged changes (`git diff --cached`) and prompts the AI to generate structural commit messages that strictly adhere to the **Conventional Commits** specification. Provides a slick interactive terminal menu to execute the commit natively.

---

## 1. Architecture Highlights
* **Staged Defenses (`utils/git.ts`)**: Natively hooks into Node's child process pipelines to extract raw metadata from `git diff --cached`. If no files are staged, it gracefully intercepts execution to prevent redundant LLM invocations or shell crashes.
* **Flexible Union Type Layer (`services/ai.ts`)**: Accepts a robust `string | TaskPayload` input structure. This abstracts away the underlying data payload, laying down the structural foundation for future batch-processing or code review tasks.
* **Resilient Dynamic Routing (`providers/*`)**: Tailored to interface with OpenRouter's smart global gateway using `openrouter/free`. It dynamically balances incoming traffic across the fastest, most reliable free coding models (such as Qwen-Coder and Gemini-Flash aggregates), **completely resolving the 429 Rate Limit issues caused by upstream traffic spikes**.
* **Immersive UX (`@clack/prompts`)**: Integrates stream-lined animations, custom loading indicators (`⠋`), and a beautiful interactive keyboard menu selector for a clean, deterministic terminal workflow.

---

## 2. Workflow Usage

Navigate to **any** local Git repository on your machine, perform modifications, and run:

```bash
# 1. Stage your incremental changes
git add .

# 2. Invoke the brain
brain commit
Terminal Experience Flow:
Loading spinner displays: ⠋ DevBrain is deeply analyzing code diffs and formatting semantics...

Outputs a clean, well-scoped commit message line (e.g., feat: add database middleware or fix: file mode issue).

Renders an interactive prompt selector:

Plaintext
◇ How would you like to handle this commit message?
│  ✅ Execute Git Commit
│  ❌ Cancel
Hit Enter to safely log the changes into your local Git history, showing: ◇ 🎉 Code committed successfully!

⚠️ Caveats & Edge Cases
Metadata Fallbacks: When adding empty files or raw configurations without concrete logical lines (e.g., running touch test.txt), the LLM intelligently detects filesystem adjustments and might fall back to fix: Fixed file mode issue or test: add test file. This is an intended contextual behavior.

Pre-Staging Mandatory: If you forget to run git add, the tool will proactively abort with a warning. Ensure changes are present in your index before invocation.


---

### 📂 File 2: Root `README.md`
Please open your root `README.md` and overwrite it with this **pure English** version:

```markdown
# ⚡️ DevBrain AI (devbrain-ai)

> A lightweight, zero-dependency AI-powered developer toolbox (CLI) built for independent developers. Architected with Node.js, TypeScript, tsup, and deep LLM pipeline integration.

`devbrain` is a highly cohesive, non-intrusive CLI toolbox designed to seamlessly traverse any Git repository across your machine, delivering instant AI-driven productivity right inside your terminal.

---

## 🛠 Toolbox Panorama

We are iteratively expanding the toolbox with highly practical, production-ready developer tools.

| Command | Status | Documentation Docs |
| :--- | :--- | :--- |
| `brain commit` | 🟢 100% Production Ready | [View Full Specs & Workflow](./docs/commit.md) |
| `brain review` | ⏳ Planned | [Specs Coming Soon](#) |
| `brain readme` | ⏳ Planned | [Specs Coming Soon](#) |

---

## 📦 Global Setup & Installation

### 1. Installation & Global Linking
Compile the source files and double-link the CLI binary globally from your project root:
```bash
pnpm run build
npm link
2. Environment Setup (.env)
Configure a .env file in the root directory of your devbrain-ai project. The application utilizes a memory-safe process injection flow to bridge securely with OpenRouter:

Plaintext
OPENAI_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
OPENAI_BASE_URL=[https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)
DEVBRAIN_MODEL=openrouter/free
DEVBRAIN_PROVIDER=openai
⚠️ Critical Security Caveat
Keep .env Restricted: Never commit your .env file to remote version control. Ensure it is explicitly isolated inside your root .gitignore.

© 2026 Xiaozhi (Steven) Xing. Powered by TypeScript & OpenRouter.