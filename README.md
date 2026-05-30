🧠 DevBrain AI
The developer's superbrain in the terminal.

DevBrain AI is a powerful CLI companion designed to streamline your development workflow. It helps you automate routine git tasks, diagnose complex terminal errors, and leverage the latest AI models directly from your command line.

🚀 Key Features
⚡ Model-Agnostic Intelligence
Unlike rigid CLI tools, DevBrain is fully Model-Aware. You are not locked into one AI provider. Whether you need the high-reasoning capabilities of claude-3.5-sonnet, the coding proficiency of qwen-2.5-coder, or the speed of gemini-flash, you can switch models on the fly.

Configure your brain:

Bash
# Set your preferred AI model
brain config --model qwen/qwen-2.5-coder-32b
🛠 Functionality
1. brain commit
Automatically analyzes your local git diff and generates high-quality, professional commit messages.

Logic Location: src/commands/commit.ts

2. brain doctor
Your terminal's best friend. When a command fails, brain doctor diagnoses the error and provides actionable fixes or explanations to get you back on track.

Logic Location: src/commands/doctor.ts

📦 Getting Started
Install: Clone the repo and install dependencies.

Setup: Create your .env file with your API keys.

Configure: Run brain config to set your desired model.

Use: Start using brain commit or brain doctor to accelerate your workflow.

🌟 Why DevBrain?
Developer First: Built for speed and efficiency.

Extensible: Easily swap between the latest SOTA models via the brain config interface.

Transparent: The logic is lightweight and easy to audit.

Pro-Tip:
Want to see how DevBrain works? Dive into src/services/ai.ts to see how we handle dynamic model injection across all provider services.