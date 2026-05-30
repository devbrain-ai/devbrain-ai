import { spawn, execSync } from 'node:child_process';
import { select, isCancel } from '@clack/prompts';
import { askAI } from '../services/ai.js';
import { generateDoctorPrompt } from '../services/doctorPrompts.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';

const stripAnsi = (str: string) => str.replace(/\x1b\[[0-9;]*m/g, '');

export async function handleBrainDoctor(
  commandArgs: string[],
  context: string = ''
): Promise<void> {
  const command = commandArgs.join(' ');
  const s = spinner();
  
  s.start(context ? 'Consulting Brain Doctor for alternatives...' : `Analyzing: ${command}...`);

  const childProcess = spawn(commandArgs[0], commandArgs.slice(1), { shell: true });
  let stderr = context; 
  childProcess.stderr.on('data', (data) => { stderr += data; });

  childProcess.on('close', async (code) => {
    if (code === 0) {
      s.succeed('Command executed successfully!');
      return;
    }

    s.fail(context ? 'Previous fix failed.' : 'Command failed. Consulting Brain Doctor...');

    const prompt = generateDoctorPrompt(JSON.stringify({ command, errorOutput: stderr }));
    const diagnosis = await askAI(prompt);

   logger.info('\n--- 🧠 Brain Doctor Diagnosis ---');
    logger.info(stripAnsi(diagnosis));
    logger.info('\n');

  // Replace your fixMatches mapping logic in doctor.ts:

const fixMatches = diagnosis.match(/```bash\n([\s\S]*?)\n```/g) || [];

const options: { label: string; value: string }[] = [];

fixMatches.forEach((match) => {
  const content = match.replace(/```bash\n|\n```/g, '').trim();
  // Split multiple lines by newline to offer them as separate, safer options
  const commands = content.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
  
  commands.forEach(cmd => {
const cleanCmd = cmd.replace(/```/g, '').trim();
    if (cleanCmd) {
        options.push({ label: `Run: ${cleanCmd}`, value: cleanCmd });
    }
});
});

    options.push({ label: '❌ Explain / Ask for different fix', value: 'explain' });
    options.push({ label: 'Exit', value: 'exit' });

    const action = await select({
      message: 'How would you like to proceed?',
      options: options,
    });

    if (isCancel(action) || action === 'exit') return;

    if (action === 'explain') {
      return handleBrainDoctor(commandArgs, `Previous attempt failed with: ${stderr}`);
    }

    const fixSpinner = spinner();
    fixSpinner.start(`Executing: ${action}...`);
    try {
      execSync(action, { stdio: 'inherit' });
      fixSpinner.succeed('Fix applied successfully!');
    } catch (e: any) {
      fixSpinner.fail('Failed to apply fix.');
      const retry = await select({
        message: 'Fix failed. Would you like to ask for a different approach?',
        options: [
          { label: 'Yes, ask for alternatives', value: 'retry' },
          { label: 'No, exit', value: 'exit' }
        ]
      });
      if (retry === 'retry') {
        return handleBrainDoctor(commandArgs, `Command "${action}" failed with: ${e.message}`);
      }
    }
  });
}