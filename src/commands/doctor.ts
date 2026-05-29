// src/commands/doctor.ts

import { spawn } from 'node:child_process';
import { askAI } from '../services/ai.js';
import { generateDoctorPrompt } from '../services/doctorPrompts.js';
import { logger } from '../utils/logger.js';
import { spinner as createSpinner } from '../utils/spinner.js';

export async function handleBrainDoctor(commandArgs: string[]): Promise<void> {
  const command = commandArgs.join(' ');
  const s = createSpinner();
  
  s.start(`Running command: ${command}...`);

  // Execute the command and capture output
  const childProcess = spawn(commandArgs[0], commandArgs.slice(1), { shell: true });
  
  let stdout = '';
  let stderr = '';

  childProcess.stdout.on('data', (data) => { stdout += data; });
  childProcess.stderr.on('data', (data) => { stderr += data; });

  childProcess.on('close', async (code) => {
    if (code === 0) {
      s.succeed('Command executed successfully!');
      if (stdout) logger.info(stdout);
      return;
    }

    s.fail('Command failed. Analyzing with Doctor...');

    // Construct the diagnostic context package
    const contextPack = JSON.stringify({
      command,
      exitCode: code,
      errorOutput: stderr,
      systemInfo: 'darwin-arm64' 
    });

    // Generate the diagnostic prompt
    const prompt = generateDoctorPrompt(contextPack);

    // Invoke the AI service
    const diagnosis = await askAI(prompt);

    logger.info(`\n--- 🧠 Brain Doctor Diagnosis ---\n`);
    logger.info(diagnosis);
  });
}