<div align="center">

# 🧠 DevBrain AI

**The AI-powered developer terminal. No dashboards. No subscriptions. Just your terminal.**

[![npm version](https://img.shields.io/npm/v/devbrain-ai)](https://www.npmjs.com/package/devbrain-ai)
[![npm downloads](https://img.shields.io/npm/dm/devbrain-ai)](https://www.npmjs.com/package/devbrain-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![Powered by OpenRouter](https://img.shields.io/badge/Powered%20by-OpenRouter-blueviolet)](https://openrouter.ai)

</div>

---

DevBrain AI is a zero-friction CLI toolbox that brings the intelligence of frontier LLMs directly into your Git workflow. No browser tabs. No copy-pasting. No context switching.

It automates the repetitive, diagnoses the painful, and reviews the risky — all from a single command.

---

## ✨ Features

| Command | What it does | Status |
| :--- | :--- | :---: |
| [`brain commit`](./docs/commit.md) | Analyzes your staged diff and generates a Conventional Commit message | 🟢 Stable |
| [`brain doctor`](./docs/doctor.md) | Diagnoses shell errors and proposes executable fixes in a recursive loop | 🟢 Stable |
| [`brain review`](./docs/review.md) | AI code review with severity triage on staged changes, branches, or files | 🟢 Stable |

---

## 🎬 Demo

### `brain commit` — Generate commit messages from your staged diff

![brain commit demo](./docs/demo-commit.gif)

---

### `brain review` — AI code review with severity triage

![brain review demo](./docs/demo-review.gif)

---

### `brain doctor` — Diagnose and fix terminal errors

![brain doctor demo](./docs/demo-doctor.gif)

---

## 🧠 Model-Agnostic by Design

DevBrain is not locked to any single AI provider or model. It routes all requests through [OpenRouter](https://openrouter.ai), giving you access to every major LLM — free or paid — with a single API key.

```bash
# Use a powerful free model
brain config --model "qwen/qwen3-8b"

# Switch to GPT-4o for critical reviews
brain config --model "openai/gpt-4o"

# Use DeepSeek for coding tasks
brain config --model "deepseek/deepseek-r1:free"
```

**Supported models include:** GPT-4o, Claude 3.5 Sonnet, Qwen 3, DeepSeek R1, Llama 3, Gemma 3, and every other model on OpenRouter.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- An [OpenRouter API key](https://openrouter.ai/keys) (free tier available)

### Installation

```bash
npm install -g devbrain-ai
```

### Configuration

Create a `.env` file in your project root:

```env
OPENAI_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://openrouter.ai/api/v1
DEVBRAIN_PROVIDER=openai
```

Set your preferred model:

```bash
brain config --model "qwen/qwen3-8b"
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## ⚡ Quick Usage

```bash
# Generate a commit message from staged changes
git add .
brain commit

# Diagnose a failed command
brain doctor "npm install --legacy-peer-deps"

# Review staged changes before committing
brain review

# Review a specific file
brain review src/auth/middleware.ts

# Review against a branch with security focus
brain review --branch main --focus security
```

---

## 📐 Architecture

```
src/
├── commands/        # CLI command handlers (commit, doctor, review)
├── services/        # Prompt engineering and AI orchestration
├── providers/       # LLM provider adapters (OpenRouter/OpenAI-compatible)
├── utils/           # Git utilities, logger, spinner
└── index.ts         # CLI entry point (Commander.js)
```

The provider layer is intentionally thin. Adding support for a new LLM provider requires implementing a single `chat()` interface — nothing else changes.

---

## 📖 Documentation

- [`brain commit`](./docs/commit.md) — Conventional Commits generation
- [`brain doctor`](./docs/doctor.md) — Recursive shell error diagnosis
- [`brain review`](./docs/review.md) — AI-powered code review

---

## 🗺 Roadmap

- [ ] `brain review --interactive` — Apply AI suggestions one by one
- [ ] `brain readme` — Generate README from codebase
- [ ] `brain test` — Generate unit tests from implementation
- [ ] Multi-provider support (native Anthropic, Google Gemini)

---

## 📄 License

MIT © 2026 Xiaozhi (Steven) Xing

---

<div align="center">
  <sub>Built with TypeScript · Powered by OpenRouter · Made for developers who live in the terminal</sub>
</div>