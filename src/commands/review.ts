// src/commands/review.ts

import { select, isCancel } from '@clack/prompts';
import { spinner } from '../utils/spinner.js';
import { logger } from '../utils/logger.js';
import { askAI } from '../services/ai.js';
import { generateReviewPrompt, type ReviewFocus } from '../services/reviewPrompts.js';
import {
  hasStagedChanges,
  getStagedDiff,
  getLastCommitDiff,
  getBranchDiff,
  getFileDiff,
} from '../utils/git.js';
import chalk from 'chalk';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewOptions {
  branch?: string;
  lastCommit?: boolean;
  focus?: ReviewFocus;
  context?: string;
}

// ─── Diff Resolution ──────────────────────────────────────────────────────────

function resolveDiff(file: string | undefined, options: ReviewOptions): {
  diff: string;
  source: string;
} {
  if (file) {
    return { diff: getFileDiff(file), source: `file: ${file}` };
  }
  if (options.branch) {
    return { diff: getBranchDiff(options.branch), source: `branch vs ${options.branch}` };
  }
  if (options.lastCommit) {
    return { diff: getLastCommitDiff(), source: 'last commit' };
  }
  return { diff: getStagedDiff(), source: 'staged changes' };
}

// ─── Output Renderer ──────────────────────────────────────────────────────────

function renderReview(raw: string): void {
  const lines = raw.split('\n');

  for (const line of lines) {
    if (line.startsWith('[CRITICAL]')) {
      console.log('\n' + chalk.bgRed.white.bold(' CRITICAL ') + chalk.red.bold(line.slice(10)));
    } else if (line.startsWith('[MEDIUM]')) {
      console.log('\n' + chalk.bgYellow.black.bold(' MEDIUM ') + chalk.yellow.bold(line.slice(8)));
    } else if (line.startsWith('[LOW]')) {
      console.log('\n' + chalk.bgBlue.white.bold(' LOW ') + chalk.blue.bold(line.slice(5)));
    } else if (line.startsWith('✅')) {
      console.log('\n' + chalk.green.bold(line));
    } else if (line.startsWith('Problem:')) {
      console.log(chalk.dim('  Problem: ') + line.slice(8).trim());
    } else if (line.startsWith('Fix:')) {
      console.log(chalk.cyan('  Fix: ') + line.slice(4).trim());
    } else if (line.startsWith('- ')) {
      console.log(chalk.red('  ' + line));
    } else if (line.startsWith('+ ')) {
      console.log(chalk.green('  ' + line));
    } else if (line.trim() === '---') {
      // divider between issues — skip, we add \n before each badge instead
    } else {
      console.log(chalk.white(line));
    }
  }
}

function renderSummary(raw: string, source: string): void {
  const critical = (raw.match(/\[CRITICAL\]/g) ?? []).length;
  const medium = (raw.match(/\[MEDIUM\]/g) ?? []).length;
  const low = (raw.match(/\[LOW\]/g) ?? []).length;
  const total = critical + medium + low;

  console.log('\n' + chalk.dim('─'.repeat(52)));
  console.log(chalk.bold('  🧠 brain review  ') + chalk.dim(`(${source})`));
  console.log(chalk.dim('─'.repeat(52)));

  if (total === 0) {
    console.log(chalk.green.bold('  ✅ Clean diff — no issues found.'));
  } else {
    if (critical > 0) console.log(chalk.red.bold(`  🔴 CRITICAL  ${critical}`));
    if (medium > 0)   console.log(chalk.yellow.bold(`  🟡 MEDIUM    ${medium}`));
    if (low > 0)      console.log(chalk.blue.bold(`  🔵 LOW       ${low}`));
    console.log(chalk.dim(`\n  ${total} issue${total > 1 ? 's' : ''} found.`));
  }
  console.log(chalk.dim('─'.repeat(52)) + '\n');
}

// ─── Main Command ─────────────────────────────────────────────────────────────

export async function reviewCommand(
  file: string | undefined,
  options: ReviewOptions
): Promise<void> {
  // 1. Validate --focus
  const validFocus: ReviewFocus[] = ['all', 'security', 'performance', 'readability'];
  if (options.focus && !validFocus.includes(options.focus)) {
    logger.error(`Invalid --focus value: "${options.focus}". Choose from: ${validFocus.join(', ')}`);
    return;
  }

  // 2. Resolve diff
  let diff: string;
  let source: string;

  try {
    ({ diff, source } = resolveDiff(file, options));
  } catch (error: any) {
    logger.error(error?.message || 'Failed to retrieve diff.');
    return;
  }

  // 3. Guard: nothing to review
  if (!diff || diff.trim().length === 0) {
    if (!options.branch && !options.lastCommit && !file) {
      // staged-mode empty diff: give a helpful message
      logger.warn('⚠️  No staged changes detected. Run "git add ." first, or use --branch / --last-commit / <file>.');
    } else {
      logger.warn('⚠️  No diff found for the specified target.');
    }
    return;
  }

  // 4. Call AI with spinner
  const s = spinner();
  s.start('DevBrain is reviewing your code changes...');

  let rawResult = '';

  try {
    const prompt = generateReviewPrompt(diff, {
      focus: options.focus,
      context: options.context,
    });
    rawResult = await askAI(prompt);
    s.stop('Review complete!');
  } catch (error: any) {
    s.stop('Failed to communicate with the core LLM node.', 1);
    logger.error(error?.message || error);
    return;
  }

  // 5. Render review output
  console.log('\n' + chalk.dim('─'.repeat(52)));
  renderReview(rawResult);
  renderSummary(rawResult, source);

  // 6. Interactive follow-up (mirrors commit.ts UX)
  const action = await select({
    message: 'What would you like to do?',
    options: [
      { value: 'copy', label: '📋 Copy review to clipboard' },
      { value: 'done', label: '✅ Done' },
    ],
  });

  if (isCancel(action) || action === 'done') {
    logger.info('Review session closed.');
    return;
  }

  if (action === 'copy') {
    try {
      const { execSync } = await import('child_process');
      // Cross-platform clipboard: macOS / Linux (xclip) / WSL
      const isWsl = process.platform === 'linux' &&
        require('fs').existsSync('/proc/version') &&
        require('fs').readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft');

      if (process.platform === 'darwin') {
        execSync(`echo ${JSON.stringify(rawResult)} | pbcopy`);
      } else if (isWsl) {
        execSync(`echo ${JSON.stringify(rawResult)} | clip.exe`);
      } else {
        execSync(`echo ${JSON.stringify(rawResult)} | xclip -selection clipboard`);
      }
      logger.success('✅ Review copied to clipboard!');
    } catch {
      logger.warn('Could not copy automatically. Here is the raw output:');
      console.log(rawResult);
    }
  }
}
