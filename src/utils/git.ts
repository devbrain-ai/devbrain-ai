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
console.log(`[DEBUG] Attempting to commit with message: "${message}"`);
  const result = spawnSync('git', ['commit', '-m', message], { stdio: 'inherit' });

  if (result.status !== 0) {
    throw new Error('Git commit failed. Check your git status or pre-commit hooks.');
  }
}

// ─── 追加到 src/utils/git.ts 的函数 ──────────────────────────────────────────
// 你的 git.ts 里已有 hasStagedChanges / getStagedDiff / execGitCommit
// 把以下三个函数追加进去即可



/** Review 最近一次 commit 的改动 */
export function getLastCommitDiff(): string {
  return execSync('git diff HEAD~1 HEAD', { encoding: 'utf-8' });
}

/** Review 当前分支与目标分支的 diff */
export function getBranchDiff(branch: string): string {
const sanitizedBranch = branch.replace(/[^a-zA-Z0-9/_.\-]/g, '');
return execSync(`git diff ${sanitizedBranch}...HEAD`, { encoding: 'utf-8' });}

/** Review 单个文件的 staged 改动（fallback 到 working tree diff） */
export function getFileDiff(file: string): string {
  try {
    // 优先读 staged diff
    const staged = execSync(`git diff --cached -- ${file}`, { encoding: 'utf-8' });
    if (staged.trim()) return staged;
    // fallback: unstaged
    return execSync(`git diff -- ${file}`, { encoding: 'utf-8' });
  } catch {
    throw new Error(`Cannot get diff for file: ${file}`);
  }
}