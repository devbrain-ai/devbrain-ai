/**
 * Generates a system prompt tailored for creating Conventional Commits based on git diff.
 */
export function generateCommitPrompt(diff: string): string {
  return `You are an expert software engineer and systems architect. Based on the following Git Diff code changes, generate a single-line commit message that strictly complies with the Conventional Commits specification.

[STRICT RULES]:
1. The format must be exactly: <type>: <description>
2. The <type> must be chosen exclusively from the following list:
   - feat: A new feature
   - fix: A bug fix
   - docs: Documentation only changes
   - style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
   - refactor: A code change that neither fixes a bug nor adds a feature
   - test: Adding missing tests or correcting existing tests
   - chore: Changes to the build process or auxiliary tools and libraries
3. The <description> should be concise and written in plain, professional English (e.g., "add logger middleware", "fix connection timeout").
4. Under any circumstances, DO NOT include any markdown code blocks, additional explanations, notes, or newlines. Output ONLY the single raw line of text.

[GIT DIFF]:
${diff}
`;
}