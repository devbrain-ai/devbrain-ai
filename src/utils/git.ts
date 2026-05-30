import { execSync, spawnSync } from 'node:child_process';

/**
 * 检查当前是否有暂存的文件
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
 * 获取当前的 Git Diff
 */
export function getStagedDiff(): string {
  try {
    return execSync('git diff --cached', { encoding: 'utf8' });
  } catch {
    return '';
  }
}

/**
 * 安全执行本地 Git Commit
 */
export function execGitCommit(message: string): void {
  // spawnSync does not invoke a shell, so no manual escaping is needed.
  // It treats the message as a literal argument.
  const result = spawnSync('git', ['commit', '-m', message], { stdio: 'inherit' });

  if (result.status !== 0) {
    throw new Error('Git commit failed. Check your git status or pre-commit hooks.');
  }
}