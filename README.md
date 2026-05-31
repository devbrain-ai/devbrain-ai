Markdown
# 🚀 DevBrain AI
The developer's superbrain in the terminal.

DevBrain AI is a powerful CLI companion designed to streamline your development workflow. It automates routine Git tasks, diagnoses complex terminal errors, and provides seamless access to the latest AI models directly from your command line.

---

## ⚡ Key Features

### 🧠 Model-Agnostic Intelligence
Unlike rigid CLI tools, DevBrain is fully **Model-Aware**. You are not locked into one AI provider or model. Our architecture leverages OpenRouter's universal API, allowing you to seamlessly switch between different LLMs based on your task—whether it's high-reasoning logic, code generation, or low-latency tasks.

* **Hot-Swappable Models**: Switch models instantly via CLI without modifying source code.
* **Provider Independent**: Use `Claude`, `Qwen`, `Llama`, `GPT`, or any model supported by OpenRouter.
* **Task-Specific Optimization**: Use specialized models (e.g., `qwen-2.5-coder-32b` for coding, `gpt-4o` for logic) exactly when you need them.

**Configure your brain:**
```bash
# Set your preferred AI model
brain config --model "qwen/qwen-2.5-coder-32b"
🛠 Functionality
1. brain commit
Automatically analyzes your local git diff and generates high-quality, professional commit messages. It includes robust data cleaning to ensure Git compatibility regardless of AI output formatting.

Logic Location: src/commands/commit.ts

2. brain doctor
Your terminal's best friend. When a command fails, brain doctor diagnoses the error and provides actionable fixes or explanations to get you back on track.

Logic Location: src/commands/doctor.ts

🚀 Getting Started
Install: Clone the repo and install dependencies.

Setup: Create your .env file with your OPENROUTER_API_KEY.

Configure: Run brain config --model <model-name> to set your desired LLM.

Use: Start using brain commit or brain doctor to accelerate your workflow.

💡 Why DevBrain?
Developer First: Built for speed, efficiency, and zero friction.

Extensible: Easily swap between the latest SOTA (State-of-the-Art) models via a unified interface.

Transparent: The logic is lightweight, modular, and easy to audit.

Pro-Tip: Want to see how DevBrain works under the hood? Dive into src/services/ai.ts to see how we handle dynamic model injection across all provider services.