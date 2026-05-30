// src/services/ai.ts
import { getProvider } from '../providers/index.js';
import { generateCommitPrompt } from './commitPrompts.js';
import { getConfig } from '../utils/config.js';

export interface TaskPayload {
  diff: string;
}

export async function askAI(payload: string | TaskPayload): Promise<string> {
  const config = getConfig();
  // 优先级：用户自定义模型 > .env 中的默认模型
  const model = config.model || process.env.DEVBRAIN_MODEL;
  
  let finalPrompt = '';
  if (typeof payload === 'object' && payload !== null && 'diff' in payload) {
    finalPrompt = generateCommitPrompt(payload.diff);
  } else if (typeof payload === 'string') {
    finalPrompt = (payload.includes('You are an expert') || payload.includes('STRICT RULES')) 
      ? payload 
      : generateCommitPrompt(payload);
  }

  const providerName = process.env.DEVBRAIN_PROVIDER || 'openai';
  
  // 核心改动：把 model 传给 provider 工厂，而不是传给 chat 方法
  const provider = getProvider(providerName, model);
  
  const response = await provider.chat(finalPrompt);
  return response.trim();
}