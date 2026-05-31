// src/services/commitPrompts.ts

/**
 * System prompt for commit message generation.
 * Injected as the 'system' role for better instruction following.
 */
export function getCommitSystemPrompt(): string {
  return `You are an expert software engineer that generates git commit messages.
Output ONLY a single line in Conventional Commits format. No explanations. No markdown. No extra text.
FORMAT: <type>: <description>
ALLOWED TYPES: feat, fix, docs, style, refactor, test, chore
EXAMPLE: feat: add user authentication middleware`;
}

/**
 * User prompt containing the diff to be analyzed.
 */
export function getCommitUserPrompt(diff: string): string {
  return `Generate a single-line commit message for the following git diff:

${diff}`;
}