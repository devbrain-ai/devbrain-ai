// src/services/ai.ts
import { getProvider } from '../providers/index.js';
import { getCommitSystemPrompt, getCommitUserPrompt } from './commitPrompts.js';
import { getConfig } from '../utils/config.js';

export interface TaskPayload {
  diff: string;
}

export async function askAI(payload: string | TaskPayload): Promise<string> {
  const config = getConfig();
  const rawModel = config.model || process.env.DEVBRAIN_MODEL;
  const model = (rawModel && /^[\w\-./: ]+$/.test(rawModel)) ? rawModel : undefined;

  const providerName = process.env.DEVBRAIN_PROVIDER || 'openai';
  const provider = getProvider(providerName, model);

  let response: string;

  if (typeof payload === 'string') {
    // Caller (review, doctor) is responsible for building the full prompt
    response = await provider.chat(payload);
  } else {
    // commit command: split into system + user for better instruction following
    response = await provider.chat(
      getCommitUserPrompt(payload.diff),
      getCommitSystemPrompt()
    );
  }

  return response.trim();
}