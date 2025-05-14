import { CHAT_CONTEXT, config } from '@/config/openai.config';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { getTokenInformation } from '@/lib/token-info';

const openai = createOpenAI({
  apiKey: config.openai.apiKey,
});

export async function generateResponse(prompt: string): Promise<string> {
  try {
    // Verificar si es una consulta de token
    const tokenCommands = [
      { regex: /^token\s+(?:info|data)\s+(.+)$/i, group: 1 },
      { regex: /^crypto\s+info\s+(.+)$/i, group: 1 }
    ];

    for (const command of tokenCommands) {
      const match = prompt.match(command.regex);
      if (match) {
        return await getTokenInformation(match[command.group]);
      }
    }

    // Si no es una consulta de token, proceder con la respuesta normal
    const { text } = await generateText({
      model: openai('gpt-4.1-mini-2025-04-14'),
      prompt: `${CHAT_CONTEXT}\n\nUsuario: ${prompt}`,
    });

    return text;
  } catch (error) {
    throw new Error('Failed to generate text');
  }
}
