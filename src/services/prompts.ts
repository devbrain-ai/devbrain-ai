/**
 * 根据代码的 Git Diff 差异，生成喂给大模型的系统提示词
 */
export function generateCommitPrompt(diff: string): string {
  return `你是一个精通底层架构的资深开发专家。请根据以下 Git Diff 代码改动，生成一行符合 Conventional Commits 规范的提交日志（Commit Message）。

【严格遵守以下规则】：
1. 格式必须为: <type>: <description>
2. type 只能从以下类型中选择：
   - feat: 新功能
   - fix: 修复 Bug
   - docs: 文档变更
   - style: 代码格式调整（不影响逻辑的空格、分号等）
   - refactor: 重构（既不修复Bug也不增加新功能）
   - test: 增加或修改测试
   - chore: 构建过程或辅助工具的变动
3. 语言请使用简练的英文或中文（推荐英文，如 add test file）。
4. 无论如何，【不要包含任何解释、不要用 Markdown 包裹、不要换行】，直接输出最终的这一行文本！

【代码改动 Diff】：
${diff}
`;
}