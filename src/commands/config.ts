// src/commands/config.ts
import { text, isCancel, cancel } from '@clack/prompts';
import { setConfig } from '../utils/config.js';

export async function configCommand(options: { model?: string }) {
  // If model is provided via flag, set it directly
  if (options.model) {
    setConfig('model', options.model);
    console.log(`✅ Model updated to: ${options.model}`);
    return;
  }

  // Interactively prompt for the model string
  const model = await text({ 
    message: 'Enter your preferred LLM model string:', 
    placeholder: 'e.g., qwen/qwen-2.5-coder-32b' 
  });

  // Handle user cancellation (Ctrl+C)
  if (isCancel(model)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  // Save the valid input to configuration
  if (model) {
    setConfig('model', model);
    console.log('✅ Configuration saved.');
  }
}