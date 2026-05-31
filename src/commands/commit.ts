// src/commands/commit.ts

import { select, isCancel } from '@clack/prompts';
import { hasStagedChanges, getStagedDiff, execGitCommit } from '../utils/git.js';
import { spinner } from '../utils/spinner.js';
import { logger } from '../utils/logger.js';
import { askAI } from '../services/ai.js';

export async function commitCommand(): Promise<void> {
  // 1. Guard check for staged files
  if (!hasStagedChanges()) {
    logger.warn('⚠️ No staged changes detected. Please run "git add ." first.');
    return;
  }

  // 2. Extract git cached diff stream
  const diff = getStagedDiff();
  
  // 3. Invoke LLM orchestration layer with active spinner loading states
  const s = spinner();
  s.start('DevBrain is deeply analyzing code diffs and formatting semantics...');
  
  let rawMessage = '';
  
  try {
rawMessage = await askAI({ diff });
    s.stop('Commit message generated successfully!');
  } catch (error: any) {
    s.stop('Failed to communicate with the core LLM node.', 1);
    logger.error(error?.message || error);
    return;
  }

const lines = rawMessage.split('\n');
const conventionalLine = lines.find(line =>
  /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+/.test(line.trim())
);
const commitMessage = (conventionalLine ?? lines[0])
  .replace(/```(text|markdown)?/g, '')
  .replace(/`/g, '')
  .trim();

  // 🥊 Terminal UX loop: Render generated context and hook option selectors
  console.log('\n----------------------------------------');
  logger.success(commitMessage);
  console.log('----------------------------------------\n');

  // Interactive menu for the operator to review and dispatch the changes
  const action = await select({
    message: 'How would you like to handle this commit message?',
    options: [
      { value: 'commit', label: '✅ Execute Git Commit' },
      { value: 'cancel', label: '❌ Cancel' }
    ]
  });

  // Safe interception if execution is aborted or SIGINT is fired (Ctrl+C)
  if (isCancel(action) || action === 'cancel') {
    logger.info('Action cancelled safely. Code was not committed.');
    return;
  }

  // 4. Execution stage: Commit verified changes permanently to local HEAD
  if (action === 'commit') {
    const finalSpinner = spinner();
    finalSpinner.start('Writing changes to local Git history...');
    try {
      // Pass the cleaned, dynamic commit message to the git utility
      execGitCommit(commitMessage);
      finalSpinner.stop('🎉 Code committed successfully!');
    } catch (error: any) {
      finalSpinner.stop('Commit execution pipeline failed.', 1);
      logger.error(error.message);
    }
  }
}// test final
