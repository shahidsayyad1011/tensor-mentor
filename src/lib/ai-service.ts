import { ChatMessage } from './data';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function sendMessage(
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Tensor Teach AI',
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are Tensor Teach AI, an academic assistant for engineering students. Provide clear, well-structured answers. Use markdown formatting for headings, lists, code blocks, and emphasis. Be concise yet thorough.',
        },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response received.';
}
