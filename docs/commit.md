# `brain commit`

Analyzes your staged Git diff and generates a single-line commit message that strictly conforms to the [Conventional Commits](https://www.conventionalcommits.org) specification. Presents an interactive terminal menu to confirm or cancel before writing to Git history.

---

## How It Works

```
git diff --cached
      │
      ▼
 Prompt Engine
(system + user split)
      │
      ▼
  OpenRouter LLM
      │
      ▼
 Output Extraction
(regex match → fallback)
      │
      ▼
 Interactive Confirm
      │
      ▼
  git commit -m
```

1. **Staged diff extraction** — Reads `git diff --cached` via Node's `child_process`. Aborts immediately if nothing is staged.
2. **Prompt construction** — Splits intent into a `system` role (format rules) and a `user` role (raw diff). This separation significantly improves instruction-following on smaller models.
3. **Output extraction** — Uses a regex pass to find the first line matching `<type>: <description>`. Falls back to the first line of output if no match is found.
4. **Interactive confirmation** — Renders a `@clack/prompts` selector. The commit only executes on explicit confirmation.

---

## Usage

```bash
# Stage your changes, then invoke
git add .
brain commit
```

**Terminal flow:**

```
⠋ DevBrain is deeply analyzing code diffs and formatting semantics...
✔ Commit message generated successfully!

----------------------------------------
feat: add AI-powered code review command
----------------------------------------

◆ How would you like to handle this commit message?
│  ✅ Execute Git Commit
│  ❌ Cancel
```

---

## Supported Commit Types

| Type | When to use |
| :--- | :--- |
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code restructure without feature or fix |
| `test` | Adding or correcting tests |
| `chore` | Build process, tooling, dependencies |

---

## Edge Cases

**Empty or trivial diffs** (e.g., `touch file.txt`) — The LLM may produce a generic message like `chore: add empty test file`. This is expected behavior; the diff contains no semantic signal.

**No staged changes** — The command aborts with a warning before any LLM call is made:
```
⚠️ No staged changes detected. Please run "git add ." first.
```

**Model non-compliance** — If the model ignores formatting instructions, the extraction layer falls back to the raw first line. Switching to a stronger model via `brain config --model` resolves this.

---

## Model Recommendations

| Use Case | Recommended Model |
| :--- | :--- |
| Free, everyday use | `qwen/qwen3-8b` |
| High accuracy | `openai/gpt-4o-mini` |
| Offline / self-hosted | Any OpenRouter-compatible local endpoint |

```bash
brain config --model "openai/gpt-4o-mini"
```

---

## Source

```
src/commands/commit.ts       # Command handler and UX loop
src/services/commitPrompts.ts  # System + user prompt construction
src/services/ai.ts           # LLM orchestration layer
src/utils/git.ts             # git diff --cached extraction
```
