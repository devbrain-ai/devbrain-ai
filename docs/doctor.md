🩺 Core Feature: brain doctor
brain doctor is a high-availability, recursive diagnostic agent built to autonomously identify, analyze, and remediate shell execution errors. It integrates a Human-in-the-Loop (HITL) feedback mechanism to ensure that if an initial fix is insufficient, the system self-corrects and iterates toward a valid solution.

1. Architecture Highlights
Recursive Diagnostic Loop (doctor.ts): Unlike standard one-shot AI prompts, brain doctor utilizes a recursive recursion pattern. If a suggested fix fails, the agent captures the stderr and the previous context, allowing the LLM to perform "Chain-of-Thought" correction until the environment is stabilized.

Intelligent Fallback Engine: Uses a resilient parsing layer that bridges the gap between structured Markdown (bash code blocks) and unstructured terminal output. If the AI skips code-block formatting, the tool's heuristic engine extracts shell commands directly from the response.

State-Aware Spinner Logic (@clack/prompts): Manages the CLI state lifecycle with granular precision. It gracefully transitions between diagnostic states—analyzing, thinking, and executing—while suppressing "failure noise" during retry loops to maintain a clean terminal environment.

Context Injection: Dynamically compiles historical error logs into the prompt payload. This ensures the AI understands the sequence of failures, effectively turning a terminal error into a structured debugging dialogue.

2. Workflow Usage
Invoke the doctor immediately when an operation fails, or use it to wrap brittle shell commands:

Bash
# Execute a command through the Brain Doctor wrapper
brain doctor <command>
Interactive Decision Flow
Diagnostic Phase: The system intercepts stderr and consults the AI for a Root Cause Analysis (RCA).

Strategic Selection: The tool renders an interactive menu containing actionable fix options parsed from the AI’s recommendation.

Recursive Explanation: If the proposed fixes are ambiguous, select ❌ Explain / Ask for different fix. This forces the AI to enter a "Deep Analysis" mode, leveraging previous failure logs to generate a more comprehensive, step-by-step resolution.

⚠️ Important Considerations
Execution Permissions: Brain Doctor may suggest privileged operations (e.g., sudo). Always review the suggested commands in the terminal buffer before confirming execution.

Probabilistic Output: As an LLM-driven tool, the depth of technical analysis may vary based on temperature settings. Utilize the Explain functionality to force higher-resolution reasoning when simple fixes fail.

Environment Parity: This tool operates on the assumption that your environment allows for standard shell execution. In highly locked-down sandboxes, ensure the tool has sufficient permissions to run execSync commands.

📋 Best Practices
Avoid "Exit" on First Try: If a command is complex (e.g., system configuration), the first AI response may be conservative. Use the Explain loop to refine the AI's understanding of the environment.

Regex Resilience: For developers extending the tool, ensure that the generateDoctorPrompt service enforces code-block constraints. This guarantees the UI parser always finds the intended command targets.

© 2026 Xiaozhi (Steven) Xing. Powered by TypeScript & OpenRouter.