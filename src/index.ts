#!/usr/bin/env node
// src/index.ts

import { Command } from 'commander';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const program = new Command();

program
  .name('brain')
  .description(`${chalk.bold.magenta('🧠 DevBrain AI')} - The developer's superbrain in the terminal`)
  .version('0.0.1');

// ── 1. commit ─────────────────────────────────────────────────────────────────
program
  .command('commit')
  .description('Read git diff and automatically generate a professional commit message')
  .action(async () => {
    const { commitCommand } = await import('./commands/commit.js');
    await commitCommand();
  });

// ── 2. doctor ─────────────────────────────────────────────────────────────────
program
  .command('doctor')
  .description('Diagnose terminal command failures and provide actionable fixes')
  .argument('[args...]', 'Command and arguments to diagnose')
  .action(async (args) => {
    if (args.length === 0) {
      console.error(chalk.red('Error: Please provide a command to diagnose.'));
      process.exit(1);
    }
    const { handleBrainDoctor } = await import('./commands/doctor.js');
    await handleBrainDoctor(args);
  });

// ── 3. config ─────────────────────────────────────────────────────────────────
program
  .command('config')
  .description('Configure your DevBrain AI preferences')
  .option('-m, --model <model>', 'Set the preferred AI model')
  .action(async (options) => {
    const { configCommand } = await import('./commands/config.js');
    await configCommand(options);
  });

// ── 4. review ─────────────────────────────────────────────────────────────────
program
  .command('review [file]')
  .description('AI-powered code review for your changes')
  .option('--branch <name>',  'Review diff between current branch and <name>')
  .option('--last-commit',    'Review the most recent commit')
  .option('--focus <area>',   'Focus: all | security | performance | readability  (default: all)')
  .option('--context <text>', 'Extra context about this change to guide the AI')
  .action(async (file, options) => {
    const { reviewCommand } = await import('./commands/review.js');
    await reviewCommand(file, options);
  });

program.parse();