// src/services/ai.ts
import { getProvider } from '../providers/index.js';
import { generateCommitPrompt } from './commitPrompts.js';
import { getConfig } from '../utils/config.js';

export interface TaskPayload {
  diff: string;
}

export async function askAI(payload: string | TaskPayload): Promise<string> {
  const config = getConfig();
const rawModel = config.model || process.env.DEVBRAIN_MODEL;
const model = (rawModel && /^[\w\-./: ]+$/.test(rawModel)) ? rawModel : undefined;
  let finalPrompt: string;

  if (typeof payload === 'string') {
    // 调用方（review、doctor）负责构建完整 prompt，直接使用
    finalPrompt = payload;
  } else {
    // commit 命令传入 { diff } 对象，套 commit prompt
    finalPrompt = generateCommitPrompt(payload.diff);
  }

  const providerName = process.env.DEVBRAIN_PROVIDER || 'openai';
  const provider = getProvider(providerName, model);
  const response = await provider.chat(finalPrompt);
  return response.trim();
}