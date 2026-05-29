import OpenAI from 'openai';

export class OpenAIProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: process.env.DEVBRAIN_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    return response.choices[0]?.message?.content || '';
  }
}
