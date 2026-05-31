// src/services/reviewPrompts.ts

export type ReviewFocus = "all" | "security" | "performance" | "readability";

export interface ReviewPromptOptions {
  focus?: ReviewFocus;
  context?: string;
}

const FOCUS_INSTRUCTIONS: Record<ReviewFocus, string> = {
  all: "Cover security vulnerabilities, performance bottlenecks, and code quality issues.",
  security: "Focus exclusively on security vulnerabilities, injection risks, authentication flaws, and unsafe patterns.",
  performance: "Focus exclusively on performance bottlenecks, inefficient algorithms, unnecessary re-computations, and memory issues.",
  readability: "Focus exclusively on naming conventions, code clarity, function length, and structural improvements.",
};

export function generateReviewPrompt(diff: string, options: ReviewPromptOptions = {}): string {
  const focus = options.focus ?? "all";
  const focusInstruction = FOCUS_INSTRUCTIONS[focus];
  const contextBlock = options.context
    ? `[CONTEXT ABOUT THIS CHANGE]:\n${options.context}\n\n`
    : "";

  return `You are a senior software engineer conducting a professional code review. ${focusInstruction}

[STRICT OUTPUT FORMAT]:
For EACH issue found, output exactly the following structure — no extra text, no preamble:

[CRITICAL|MEDIUM|LOW] <Issue Title (max 8 words)>
Problem: <One sentence describing the exact issue.>
Fix: <One sentence describing the recommended solution.>

\`\`\`diff
- // problematic code
+ // suggested fix
\`\`\`

---

[SEVERITY DEFINITIONS]:
- [CRITICAL]: Security vulnerability, data loss risk, or logic bug that causes failures.
- [MEDIUM]: Performance issue, anti-pattern, or code smell that degrades maintainability.
- [LOW]: Style, naming, or minor readability improvement.

[RULES]:
1. Output ONLY the structured blocks above. No summaries, no preamble, no closing remarks.
2. If the diff is large, prioritize CRITICAL and MEDIUM issues only.
3. If no issues are found, output exactly one line: ✅ LGTM — No issues found.
4. If ANY issues are found, do NOT output the LGTM line under any circumstances.
5. Do not repeat issues that are the same root cause in different locations.

${contextBlock}[GIT DIFF]:
${diff}`;
}
