# `brain doctor`

A recursive diagnostic agent that intercepts shell execution failures, consults an LLM for root cause analysis, and presents executable fix options in an interactive loop. If the first fix fails, the agent re-enters with the accumulated error context — iterating until the environment is stabilized or you choose to exit.

---

## How It Works

```
brain doctor "<command>"
        │
        ▼
  spawn() + stderr capture
        │
     exit code?
        │
   ┌────┴────┐
  = 0       ≠ 0
   │         │
 success   LLM diagnosis
             │
             ▼
      Interactive fix menu
             │
      ┌──────┴──────┐
   run fix       explain / retry
      │               │
   execSync      recursive call
                 (with error context)
```

1. **Command execution** — Spawns the target command via `child_process.spawn`. Captures `stderr` in real time.
2. **LLM diagnosis** — On non-zero exit, sends the command and error output to the LLM for root cause analysis.
3. **Fix extraction** — Parses `bash` code blocks from the LLM response. Falls back to heuristic line matching if the model skips Markdown formatting.
4. **Interactive loop** — Presents runnable fixes as a `@clack/prompts` selector. Executes the selected command via `execSync`.
5. **Recursive retry** — If the fix fails or you request an alternative, the agent re-invokes itself with the full failure history injected into the next prompt.

---

## Usage

```bash
# Wrap any failing command
brain doctor "npm install --legacy-peer-deps"
brain doctor "git push origin main"
brain doctor "docker build -t myapp ."
```

**Terminal flow:**

```
⠋ Analyzing: npm install --legacy-peer-deps...
✖ Command failed. Consulting Brain Doctor...

--- 🧠 Brain Doctor Diagnosis ---
The error indicates a peer dependency conflict between react@18 and
react-dom@17. The --legacy-peer-deps flag alone is insufficient here.

◆ How would you like to proceed?
│  ● Run: npm install --force
│  ○ Run: npm install react-dom@18
│  ○ ❌ Explain / Ask for different fix
│  ○ Exit
```

---

## Recursive Explanation Mode

When no proposed fix works, select **Explain / Ask for different fix**. The agent re-enters with the full error history:

```bash
# The next LLM call receives:
# - Original command
# - Original stderr
# - All previously attempted fixes
# - Their failure output
```

This forces the model into deeper reasoning rather than repeating the same suggestions.

---

## Important Considerations

**Review before executing** — The agent may suggest privileged commands (`sudo`, `rm -rf`). Always read the proposed command in the menu before confirming.

**Environment assumptions** — The tool assumes standard shell execution permissions. In sandboxed or restricted environments, `execSync` may fail regardless of the fix content.

**Model quality matters** — Diagnostic depth varies by model. For complex system errors, switch to a stronger model:

```bash
brain config --model "openai/gpt-4o"
brain doctor "your failing command"
```

---

## Source

```
src/commands/doctor.ts         # Recursive diagnostic loop and UX
src/services/doctorPrompts.ts  # Prompt construction with error context
src/services/ai.ts             # LLM orchestration layer
```
