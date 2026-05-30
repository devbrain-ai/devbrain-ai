import { spawn, execSync } from 'node:child_process';
import { select, isCancel } from '@clack/prompts';
import { askAI } from '../services/ai.js';
import { generateDoctorPrompt } from '../services/doctorPrompts.js';
import { logger } from '../utils/logger.js';
import { spinner } from '../utils/spinner.js';

// Helper to strip Markdown markers for clean terminal output
const formatForDisplay = (str: string) => 
  str.replace(/###/g, '')
     .replace(/```bash/g, '')
     .replace(/```/g, '')
     .trim();

export async function handleBrainDoctor(
  commandArgs: string[],
  context: string = ''
): Promise<void> {
  const command = commandArgs.join(' ');
  const s = spinner();
  
  // Use distinct messages for initial analysis vs recursive retries
  s.start(context ? 'Brain Doctor is thinking about a better approach...' : `Analyzing: ${command}...`);

  const childProcess = spawn(commandArgs[0], commandArgs.slice(1), { shell: true });
  let stderr = context; 
  childProcess.stderr.on('data', (data) => { stderr += data; });

  childProcess.on('close', async (code) => {
    if (code === 0) {
      s.succeed('Command executed successfully!');
      return;
    }

    // Only trigger failure UI if this is the first attempt
    if (!context) {
      s.fail('Command failed. Consulting Brain Doctor...');
    }

    const prompt = generateDoctorPrompt(JSON.stringify({ command, errorOutput: stderr }));
    const diagnosis = await askAI(prompt);

    // Stop spinner before printing diagnosis to prevent UI glitches
    // @ts-ignore: bypasses strict typing issues in custom wrappers
    s.stop({}); 

    console.log('\n--- 🧠 Brain Doctor Diagnosis ---');
    console.log(formatForDisplay(diagnosis));
    console.log('\n');

    // Parse commands using regex for code blocks
    const fixMatches: string[] = diagnosis.match(/```bash\n([\s\S]*?)\n```/g) || [];

    // Fallback: If no code blocks are found, try to extract command-like lines
    if (fixMatches.length === 0) {
        const lines = diagnosis.split('\n');
        const potentialCmds = lines.filter(line => 
            /^(sudo|mkdir|rm|chmod|chown|git|npm|yarn|docker)\s+/i.test(line.trim())
        );
        potentialCmds.forEach(cmd => {
            fixMatches.push(`\`\`\`bash\n${cmd.trim()}\n\`\`\``);
        });
    }

    const options: { label: string; value: string }[] = [];

    fixMatches.forEach((match) => {
      const content = match.replace(/```bash\n|\n```/g, '').trim();
      const commands = content.split('\n').filter(line => line.trim() !== '' && !line.startsWith('#'));
      
      commands.forEach((cmd) => {
        const cleanCmd = cmd.trim();
        if (cleanCmd) {
          options.push({ label: `Run: ${cleanCmd}`, value: cleanCmd });
        }
      });
    });

    // Provide default options if AI failed to return any valid commands
    if (options.length === 0) {
      options.push({ label: '⚠️ No commands found. Ask for a better fix?', value: 'explain' });
    }

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