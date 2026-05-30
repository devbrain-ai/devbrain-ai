// src/providers/index.ts
import { OpenAIProvider } from './openai.js';

export function getProvider(name: string, model?: string) {
  switch (name.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider(model);
    default:
      throw new Error(`Unsupported provider: ${name}`);
  }
}