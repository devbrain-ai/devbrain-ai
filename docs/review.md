# `brain review`

An AI code reviewer that runs inside your terminal. It reads your Git diff, triages every issue by severity, and presents structured findings with before/after code suggestions. No browser. No pull request required.

---

## How It Works

```
diff source resolution
(staged / last commit / branch / file)
        │
        ▼
  Prompt construction
  (focus + context injection)
        │
        ▼
    OpenRouter LLM
        │
        ▼
  Severity-tagged output
  [CRITICAL] [MEDIUM] [LOW]
        │
        ▼
  Rendered terminal output
  + summary footer
```

1. **Diff resolution** — Selects the appropriate `git diff` command based on your flags. Defaults to `git diff --cached` (staged changes).
2. **Prompt construction** — Injects a structured review template with optional focus area and context. The LLM is instructed to output only tagged issue blocks — no prose, no filler.
3. **Severity triage** — Every finding is tagged `[CRITICAL]`, `[MEDIUM]`, or `[LOW]` with a one-line problem description, a one-line fix, and a diff suggestion.
4. **Rendered output** — Issues are color-coded in the terminal. A summary footer shows the total count by severity.

---

## Usage

```bash
# Review staged changes (default)
brain review

# Review the most recent commit
brain review --last-commit

# Review diff against a branch
brain review --branch main

# Review a specific file
brain review src/auth/middleware.ts

# Focus on a specific concern
brain review --focus security
brain review --focus performance
brain review --focus readability

# Add context to guide the AI
brain review --context "This refactors the auth layer to use JWTs"
```

---

## Terminal Output

```
 CRITICAL  Unsanitized user input in SQL query
  Problem: User-controlled input is interpolated directly into the query string.
  Fix: Use parameterized queries or a prepared statement library.

- const result = db.query(`SELECT * FROM users WHERE id = ${userId}`);
+ const result = db.query('SELECT * FROM users WHERE id = ?', [userId]);

────────────────────────────────────────────────────
 MEDIUM  Synchronous file read on hot path
  Problem: fs.readFileSync blocks the event loop on every request.
  Fix: Replace with fs.promises.readFile and await the result.

────────────────────────────────────────────────────
  🧠 brain review  (staged changes)
────────────────────────────────────────────────────
  🔴 CRITICAL  1
  🟡 MEDIUM    1

  2 issues found.
────────────────────────────────────────────────────
```

---

## Severity Definitions

| Level | Meaning |
| :--- | :--- |
| `CRITICAL` | Security vulnerability, data loss risk, or logic bug that causes failures |
| `MEDIUM` | Performance issue, anti-pattern, or maintainability concern |
| `LOW` | Style, naming, or minor readability improvement |

---

## Focus Modes

| Flag | What the LLM prioritizes |
| :--- | :--- |
| `--focus all` | Security, performance, and code quality (default) |
| `--focus security` | Injection risks, authentication flaws, unsafe patterns |
| `--focus performance` | Bottlenecks, blocking calls, inefficient algorithms |
| `--focus readability` | Naming, structure, function length, clarity |

---

## Edge Cases

**Nothing staged** — Aborts with a clear message before any LLM call:
```
⚠️ No staged changes detected. Run "git add ." first,
   or use --branch / --last-commit / <file>.
```

**Clean diff** — If the LLM finds nothing wrong:
```
✅ LGTM — No issues found.
```

**Large diffs** — The prompt instructs the model to prioritize `CRITICAL` and `MEDIUM` issues when the diff exceeds its effective reasoning window.

---

## Model Recommendations

| Use Case | Recommended Model |
| :--- | :--- |
| Free, everyday reviews | `qwen/qwen3-8b` |
| Security-focused reviews | `openai/gpt-4o` |
| Performance analysis | `deepseek/deepseek-r1:free` |

```bash
brain config --model "openai/gpt-4o"
brain review --focus security
```

---

## Source

```
src/commands/review.ts         # Command handler, renderer, summary footer
src/services/reviewPrompts.ts  # Prompt construction with focus + context
src/services/ai.ts             # LLM orchestration layer
src/utils/git.ts               # Diff resolution (staged / branch / file)
```
