import { OpenAIProvider } from './openai.js';

export function getProvider(name: string) {
  switch (name.toLowerCase()) {
    case 'openai':
      return new OpenAIProvider();
    default:
      throw new Error(`Unsupported provider: ${name}`);
  }
}
