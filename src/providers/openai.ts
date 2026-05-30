// src/providers/openai.ts
export class OpenAIProvider {
  private model: string;

  constructor(model?: string) {
    // Priority: Argument passed > Environment Variable > Default
    this.model = model || process.env.DEVBRAIN_MODEL || 'gpt-4o';
  }

  async chat(prompt: string): Promise<string> {
    // Ensure base URL is correctly formatted for OpenRouter
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';
    
    const requestBody = {
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    };

    console.log(`[DEBUG] Requesting model: ${this.model}`);
    console.log(`[DEBUG] Target URL: ${baseUrl}/chat/completions`);

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'HTTP-Referer': 'https://github.com/devbrain-ai/devbrain-ai',
        'X-Title': 'DevBrain AI',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || 'Unknown error';
      
      // Specifically catch model ID errors to help you debug
      if (response.status === 400) {
        console.error(`[ERROR] Request Payload:`, JSON.stringify(requestBody, null, 2));
        throw new Error(`API Error (400): OpenRouter rejected the model '${this.model}'. Please verify if this model ID is valid on OpenRouter. Details: ${errorMessage}`);
      }
      
      throw new Error(`API Error: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    
    // Safety check for response structure
    if (!data.choices || data.choices.length === 0) {
      throw new Error('API returned an empty response.');
    }

    return data.choices[0].message.content;
  }
}