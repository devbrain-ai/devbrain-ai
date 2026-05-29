import { getProvider } from '../providers/index.js';
import { generateCommitPrompt } from './commitPrompts.js';

export interface TaskPayload {
  diff: string;
}

export async function askAI(payload: string | TaskPayload): Promise<string> {
  let finalPrompt = '';

  if (typeof payload === 'object' && payload !== null && 'diff' in payload) {
    finalPrompt = generateCommitPrompt(payload.diff);
  } else if (typeof payload === 'string') {
    if (payload.includes('You are an expert') || payload.includes('STRICT RULES')) {
      finalPrompt = payload;
    } else {
      finalPrompt = generateCommitPrompt(payload);
    }
  }

  const providerName = process.env.DEVBRAIN_PROVIDER || 'openai';
  const provider = getProvider(providerName);
  
  const response = await provider.chat(finalPrompt);

  return response.trim();
}