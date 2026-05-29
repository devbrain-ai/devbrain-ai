import { spawn, execSync } from 'node:child_process';
import { select, isCancel } from '@clack/prompts';
import { askAI } from '../services/ai.js';
import { generateDoctorPrompt } from '../services/doctorPrompts.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';

export async function handleBrainDoctor(commandArgs: string[]): Promise<void> {
  const command = commandArgs.join(' ');
  const s = spinner();
  s.start(`Analyzing: ${command}...`);

  const childProcess = spawn(commandArgs[0], commandArgs.slice(1), { shell: true });
  let stderr = '';
  childProcess.stderr.on('data', (data) => { stderr += data; });

  childProcess.on('close', async (code) => {
    if (code === 0) {
      s.succeed('Command executed successfully!');
      return;
    }

    s.fail('Command failed. Consulting Brain Doctor...');

    const prompt = generateDoctorPrompt(JSON.stringify({ command, errorOutput: stderr }));
    const diagnosis = await askAI(prompt);

    logger.info(`\n--- 🧠 Brain Doctor Diagnosis ---\n${diagnosis}\n`);

    // Extract potential commands (simplified logic: look for lines starting with ```bash)
    const fixMatches = diagnosis.match(/```bash\n([\s\S]*?)\n```/g);
    
    if (fixMatches) {
      const options = fixMatches.map((match) => {
        const commandLine = match.replace(/```bash\n|\n```/g, '').trim();
        return { label: `Run: ${commandLine}`, value: commandLine };
      });

      options.push({ label: 'Exit', value: 'exit' });

      const action = await select({
        message: 'Would you like to run one of these fixes?',
        options: options,
      });

      if (!isCancel(action) && action !== 'exit') {
        const fixSpinner = spinner();
        fixSpinner.start(`Executing: ${action}...`);
        try {
          execSync(action, { stdio: 'inherit' });
          fixSpinner.succeed('Fix applied successfully!');
        } catch (e) {
          fixSpinner.fail('Failed to apply fix.');
        }
      }
    }
  });
}