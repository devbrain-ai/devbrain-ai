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
program.name("brain").description(`${chalk.bold.magenta("\u{1F9E0} DevBrain AI")} - \u7EC8\u7AEF\u91CC\u7684\u5F00\u53D1\u8005\u8D85\u7EA7\u5927\u8111`).version("0.0.1");
program.command("commit").description("\u8BFB\u53D6 git diff \u5E76\u81EA\u52A8\u751F\u6210\u4F18\u96C5\u7684 Commit Message").action(async () => {
  const { commitCommand } = await import("./commit-XUAMKIWI.js");
  await commitCommand();
});
program.parse();
