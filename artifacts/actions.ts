import { CHAT_CONTEXT, config } from '@/config/openai.config';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import {
  getTokenInformation,
  getTokenPrice,
  convertCrypto,
} from '@/lib/token-info';

const openai = createOpenAI({
  apiKey: config.openai.apiKey,
});

export async function generateResponse(prompt: string): Promise<string> {
  try {
    // Verificar si es una consulta de precio
    const priceRegex =
      /(?:cuánto|cuanto|qué|que|cual|cuál)\s+(?:vale|cuesta|es el precio de|precio)\s+(?:un |1 )?([a-zA-Z0-9]+)(?:\s+actual)?/i;
    const priceMatch = prompt.match(priceRegex);
    if (priceMatch) {
      return await getTokenPrice(priceMatch[1]);
    }

    // Verificar si es una consulta de conversión
    // Patrones como "¿Cuánto son 0.5 ETH en dólares?" o "¿Cuánto son 100 USD en BTC?"
    const conversionRegex =
      /(?:cuánto|cuanto)\s+(?:son|es|vale|valen)\s+([0-9.]+)\s+([a-zA-Z]+)\s+en\s+([a-zA-Z]+)/i;
    const conversionMatch = prompt.match(conversionRegex);
    if (conversionMatch) {
      const amount = parseFloat(conversionMatch[1]);
      const fromCurrency = conversionMatch[2];
      const toCurrency = conversionMatch[3];

      if (!isNaN(amount)) {
        return await convertCrypto(amount, fromCurrency, toCurrency);
      }
    }

    // Verificar si es una consulta de token específica
    const tokenCommands = [
      { regex: /^token\s+(?:info|data)\s+(.+)$/i, group: 1 },
      { regex: /^crypto\s+info\s+(.+)$/i, group: 1 },
    ];

    for (const command of tokenCommands) {
      const match = prompt.match(command.regex);
      if (match) {
        return await getTokenInformation(match[command.group]);
      }
    }

    // Si no es una consulta específica, proceder con la respuesta normal
    const { text } = await generateText({
      model: openai('gpt-4.1-mini-2025-04-14'),
      prompt: `${CHAT_CONTEXT}\n\nUsuario: ${prompt}`,
    });

    return text;
  } catch (error) {
    throw new Error('Failed to generate text');
  }
}
