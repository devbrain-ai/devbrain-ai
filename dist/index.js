#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
import chalk from "chalk";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, "../.env") });
var program = new Command();
program.name("brain").description(`${chalk.bold.magenta("\u{1F9E0} DevBrain AI")} - The developer's superbrain in the terminal`).version("0.0.1");
program.command("commit").description("Read git diff and automatically generate a professional commit message").action(async () => {
  const { commitCommand } = await import("./commit-SZLRQO26.js");
  await commitCommand();
});
program.command("doctor").description("Diagnose terminal command failures and provide actionable fixes").argument("[args...]", 'Command and arguments to diagnose (e.g., "pnpm build")').action(async (args) => {
  if (args.length === 0) {
    console.error(chalk.red("Error: Please provide a command to diagnose."));
    process.exit(1);
  }
  const { handleBrainDoctor } = await import("./doctor-JFLH4OMM.js");
  await handleBrainDoctor(args);
});
program.parse();
