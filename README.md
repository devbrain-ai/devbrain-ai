# ⚡️ DevBrain AI (devbrain-ai)

> A lightweight, zero-dependency AI-powered developer toolbox (CLI) built for independent developers. Architected with Node.js, TypeScript, tsup, and deep LLM pipeline integration.

`devbrain` is a highly cohesive, non-intrusive CLI toolbox designed to seamlessly traverse any Git repository across your machine (React Native apps, SaaS platforms, web apps, etc.), delivering instant AI-driven productivity right inside your terminal.

---

## 🛠 Toolbox Panorama

We are iteratively expanding the toolbox with highly practical, production-ready developer tools.

| Command | Status | Tech Stack Summary |
| :--- | :--- | :--- |
| `brain commit` | 🟢 100% Production Ready | Git stage diff stream parsing + OpenRouter dynamic router + Interactive Clack prompts |
| `brain review` | ⏳ Planned | Incremental Code Review, vulnerability scanning, and anti-pattern detection |
| `brain readme` | ⏳ Planned | Full-project tree analysis and automated Markdown documentation generator |

---

## 🚀 Core Feature: `brain commit`

Deeply analyzes your local Git staged changes (`git diff --cached`) and prompts the AI to generate structural commit messages that strictly adhere to the **Conventional Commits** specification. Provides a slick interactive terminal menu to execute the commit natively.

### 1. Architecture Highlights
* **Staged Defenses (`utils/git.ts`)**: Natively hooks into Node's child process pipelines to extract raw metadata from `git diff --cached`. If no files are staged, it gracefully intercepts execution to prevent redundant LLM invocations or shell crashes.
* **Flexible Union Type Layer (`services/ai.ts`)**: Accepts a robust `string | TaskPayload` input structure. This abstracts away the underlying data payload, laying down the structural foundation for future batch-processing or code review tasks.
* **Resilient Dynamic Routing (`providers/*`)**: Tailored to interface with OpenRouter's smart global gateway using `openrouter/free`. It dynamically balances incoming traffic across the fastest, most reliable free coding models (such as Qwen-Coder and Gemini-Flash aggregates), **completely resolving the 429 Rate Limit issues caused by upstream traffic spikes**.
* **Immersive UX (`@clack/prompts`)**: Integrates stream-lined animations, custom loading indicators (`⠋`), and a beautiful interactive keyboard menu selector for a clean, deterministic terminal workflow.

### 2. Installation & Global Linking

Compile the source files and double-link the CLI binary globally from your project root:
```bash
pnpm run build
npm link
Note: Thanks to the nature of symbolic links via npm link, you only need to run this once. Any future changes made inside src/ and compiled with pnpm run build will instantly reflect globally across all project environments.

3. Environment Setup (.env)
Configure a .env file in the root directory of your devbrain-ai project. The application utilizes a memory-safe process injection flow to bridge securely with OpenRouter:

Plaintext
# Your authentic OpenRouter API Key
OPENAI_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx

# Redirecting the native OpenAI SDK to OpenRouter gateways
OPENAI_BASE_URL=[https://openrouter.ai/api/v1](https://openrouter.ai/api/v1)

# Leveraging the official aggregate free-tier route to bypass 429s
DEVBRAIN_MODEL=openrouter/free

# Provider selector flag
DEVBRAIN_PROVIDER=openai
4. Workflow Usage
Navigate to any local Git repository on your machine, perform modifications, and run:

Bash
# 1. Stage your incremental changes
git add .

# 2. Invoke the brain
brain commit
Terminal Experience Flow:

Loading spinner displays: ⠋ DevBrain 正在深度解析代码改动并组织语言... (Analyzing changes and preparing syntax).

Outputs a clean, well-scoped commit message line (e.g., feat: add database middleware or fix: file mode issue).

Renders an interactive prompt selector. Select ✅ 直接提交 (Execute Git Commit) using your arrow keys and hit Enter to safely log the changes into your local Git history.

⚠️ Caveats & Edge Cases
Keep .env Restricted: Never commit your .env file to remote version control. Ensure it is explicitly isolated inside your root .gitignore.

Metadata Fallbacks: When adding empty files or raw configurations without concrete logical lines (e.g., running touch test.txt), the LLM intelligently detects filesystem adjustments and might fall back to fix: Fixed file mode issue or test: add test file. This is an intended contextual behavior.

Pre-Staging Mandatory: If you forget to run git add, the tool will proactively abort with a warning. Ensure changes are present in your index before invocation.

📅 Roadmap Evolution
When integrating upcoming utilities like brain review or brain readme, we will rigidly follow the established Command -> Service -> Providers -> Utils decoupling pattern to maintain a highly maintainable and clean project codebase.

© 2026 Xiaozhi (Steven) Xing. Powered by TypeScript & OpenRouter.
