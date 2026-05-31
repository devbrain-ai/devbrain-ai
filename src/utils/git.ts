import { execSync, spawnSync } from 'node:child_process';

/**
 * Check whether there are any staged files in the current repository.
 */
export function hasStagedChanges(): boolean {
  try {
    const stdout = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * Return the staged git diff as a string.
 */
export function getStagedDiff(): string {
  try {
    return execSync('git diff --cached', { encoding: 'utf8' });
  } catch {
    return '';
  }
}

/**
 * Safely execute a local git commit with the given message.
 */
export function execGitCommit(message: string): void {
  const result = spawnSync('git', ['commit', '-m', message], { stdio: 'inherit' });

  if (result.status !== 0) {
    throw new Error('Git commit failed. Check your git status or pre-commit hooks.');
  }
}

/**
 * Return the diff introduced by the most recent commit.
 */
export function getLastCommitDiff(): string {
  return execSync('git diff HEAD~1 HEAD', { encoding: 'utf-8' });
}

/**
 * Return the diff between the current HEAD and the specified branch.
 * The branch name is sanitized to prevent command injection.
 */
export function getBranchDiff(branch: string): string {
  const sanitizedBranch = branch.replace(/[^a-zA-Z0-9/_.\-]/g, '');
  return execSync(`git diff ${sanitizedBranch}...HEAD`, { encoding: 'utf-8' });
}

/**
 * Return the diff for a specific file.
 * Tries staged changes first, falls back to unstaged working tree diff.
 * The file path is sanitized to prevent command injection.
 */
export function getFileDiff(file: string): string {
  const sanitizedFile = file.replace(/[^\w./\-]/g, '');
  try {
    const staged = execSync(`git diff --cached -- ${sanitizedFile}`, { encoding: 'utf-8' });
    if (staged.trim()) return staged;
    return execSync(`git diff -- ${sanitizedFile}`, { encoding: 'utf-8' });
  } catch {
    throw new Error(`Cannot get diff for file: ${sanitizedFile}`);
  }
}