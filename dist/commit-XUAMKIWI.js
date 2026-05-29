// src/commands/commit.ts
import { select, isCancel } from "@clack/prompts";

// src/utils/git.ts
import { execSync } from "child_process";
function hasStagedChanges() {
  try {
    const stdout = execSync("git diff --cached --name-only", { encoding: "utf8" });
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}
function getStagedDiff() {
  try {
    return execSync("git diff --cached", { encoding: "utf8" });
  } catch {
    return "";
  }
}
function execGitCommit(message) {
  try {
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
  } catch (error) {
    throw new Error("\u6267\u884C git commit \u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u672C\u5730 Git \u72B6\u6001\u3002");
  }
}

// src/utils/spinner.ts
import { spinner } from "@clack/prompts";
function showSpinner(message) {
  const s = spinner();
  s.start(message);
  return {
    /**
     * 停止动画
     * @param msg 停止时显示的提示文字
     * @param _code 留着这个参数兼容 commit.ts 的调用，加下划线表示暂不使用，规避 TS 报错
     */
    stop(msg, _code = 0) {
      s.stop(msg);
    }
  };
}

// src/utils/logger.ts
import chalk from "chalk";
var logger = {
  info: (msg) => console.log(chalk.blue(msg)),
  success: (msg) => console.log(chalk.green(msg)),
  warn: (msg) => console.log(chalk.yellow(msg)),
  error: (msg, err) => console.error(chalk.red(msg), err || ""),
  dim: (msg) => console.log(chalk.dim(msg))
};

// src/providers/openai.ts
import OpenAI from "openai";
var OpenAIProvider = class {
  client;
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  async chat(prompt) {
    const response = await this.client.chat.completions.create({
      model: process.env.DEVBRAIN_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });
    return response.choices[0]?.message?.content || "";
  }
};

// src/providers/index.ts
function getProvider(name) {
  switch (name.toLowerCase()) {
    case "openai":
      return new OpenAIProvider();
    default:
      throw new Error(`Unsupported provider: ${name}`);
  }
}

// src/services/prompts.ts
function generateCommitPrompt(diff) {
  return `\u4F60\u662F\u4E00\u4E2A\u7CBE\u901A\u5E95\u5C42\u67B6\u6784\u7684\u8D44\u6DF1\u5F00\u53D1\u4E13\u5BB6\u3002\u8BF7\u6839\u636E\u4EE5\u4E0B Git Diff \u4EE3\u7801\u6539\u52A8\uFF0C\u751F\u6210\u4E00\u884C\u7B26\u5408 Conventional Commits \u89C4\u8303\u7684\u63D0\u4EA4\u65E5\u5FD7\uFF08Commit Message\uFF09\u3002

\u3010\u4E25\u683C\u9075\u5B88\u4EE5\u4E0B\u89C4\u5219\u3011\uFF1A
1. \u683C\u5F0F\u5FC5\u987B\u4E3A: <type>: <description>
2. type \u53EA\u80FD\u4ECE\u4EE5\u4E0B\u7C7B\u578B\u4E2D\u9009\u62E9\uFF1A
   - feat: \u65B0\u529F\u80FD
   - fix: \u4FEE\u590D Bug
   - docs: \u6587\u6863\u53D8\u66F4
   - style: \u4EE3\u7801\u683C\u5F0F\u8C03\u6574\uFF08\u4E0D\u5F71\u54CD\u903B\u8F91\u7684\u7A7A\u683C\u3001\u5206\u53F7\u7B49\uFF09
   - refactor: \u91CD\u6784\uFF08\u65E2\u4E0D\u4FEE\u590DBug\u4E5F\u4E0D\u589E\u52A0\u65B0\u529F\u80FD\uFF09
   - test: \u589E\u52A0\u6216\u4FEE\u6539\u6D4B\u8BD5
   - chore: \u6784\u5EFA\u8FC7\u7A0B\u6216\u8F85\u52A9\u5DE5\u5177\u7684\u53D8\u52A8
3. \u8BED\u8A00\u8BF7\u4F7F\u7528\u7B80\u7EC3\u7684\u82F1\u6587\u6216\u4E2D\u6587\uFF08\u63A8\u8350\u82F1\u6587\uFF0C\u5982 add test file\uFF09\u3002
4. \u65E0\u8BBA\u5982\u4F55\uFF0C\u3010\u4E0D\u8981\u5305\u542B\u4EFB\u4F55\u89E3\u91CA\u3001\u4E0D\u8981\u7528 Markdown \u5305\u88F9\u3001\u4E0D\u8981\u6362\u884C\u3011\uFF0C\u76F4\u63A5\u8F93\u51FA\u6700\u7EC8\u7684\u8FD9\u4E00\u884C\u6587\u672C\uFF01

\u3010\u4EE3\u7801\u6539\u52A8 Diff\u3011\uFF1A
${diff}
`;
}

// src/services/ai.ts
async function askAI(payload) {
  const diff = typeof payload === "string" ? payload : payload.diff;
  const prompt = generateCommitPrompt(diff);
  const providerName = process.env.DEVBRAIN_PROVIDER || "openai";
  const provider = getProvider(providerName);
  const response = await provider.chat(prompt);
  return response.trim();
}

// src/commands/commit.ts
async function commitCommand() {
  if (!hasStagedChanges()) {
    logger.warn('\u26A0\uFE0F No staged changes detected. Please run "git add ." first.');
    return;
  }
  const diff = getStagedDiff();
  const spinner2 = showSpinner("DevBrain is deeply analyzing code diffs and formatting semantics...");
  let commitMessage = "";
  try {
    commitMessage = await askAI(diff);
    spinner2.stop("Commit message generated successfully!");
  } catch (error) {
    spinner2.stop("Failed to communicate with the core LLM node.", 1);
    logger.error(error?.message || error);
    return;
  }
  console.log("\n----------------------------------------");
  logger.success(commitMessage);
  console.log("----------------------------------------\n");
  const action = await select({
    message: "How would you like to handle this commit message?",
    options: [
      { value: "commit", label: "\u2705 Execute Git Commit" },
      { value: "cancel", label: "\u274C Cancel" }
    ]
  });
  if (isCancel(action) || action === "cancel") {
    logger.info("Action cancelled safely. Code was not committed.");
    return;
  }
  if (action === "commit") {
    const finalSpinner = showSpinner("Writing changes to local Git history...");
    try {
      execGitCommit(commitMessage);
      finalSpinner.stop("\u{1F389} Code committed successfully!");
    } catch (error) {
      finalSpinner.stop("Commit execution pipeline failed.", 1);
      logger.error(error.message);
    }
  }
}
export {
  commitCommand
};
