import { execSync } from 'node:child_process';

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
  try {
    // 使用 node 原生底层方法执行 commit，对 message 进行安全转义，防止特殊字符报错
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
  } catch (error) {
    throw new Error('执行 git commit 失败，请检查本地 Git 状态。');
  }
}