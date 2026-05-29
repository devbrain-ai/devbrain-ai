#!/usr/bin/env node

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
  .description(`${chalk.bold.magenta('🧠 DevBrain AI')} - 终端里的开发者超级大脑`)
  .version('0.0.1');

program
  .command('commit')
  .description('读取 git diff 并自动生成优雅的 Commit Message')
  .action(async () => {
    const { commitCommand } = await import('./commands/commit.js');
    await commitCommand();
  });

program.parse();
