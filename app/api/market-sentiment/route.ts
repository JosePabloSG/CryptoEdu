import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET_KEY,
});

async function getCurrentPrices() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
  return await response.json();
}

export async function GET(req: VercelRequest, res: VercelResponse) {
  try {
    const prices = await getCurrentPrices();

    const prompt = `
      Analiza las siguientes variaciones de precio en las últimas 24 horas:
      BTC: ${prices.bitcoin.usd_24h_change}%
      ETH: ${prices.ethereum.usd_24h_change}%
      SOL: ${prices.solana.usd_24h_change}%
      
      Proporciona un análisis técnico breve y una predicción para cada uno.
      Responde en formato JSON con la siguiente estructura para cada cripto:
      {
        symbol: string,
        percentage: number,
        direction: "up" | "down",
        prediction: string (máximo 100 caracteres)
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un analista experto en mercados crypto. Proporciona análisis técnicos concisos y realistas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{}');

    return Response.json({ trends: analysis.trends });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: "Error analyzing market sentiment" },
      { status: 500 }
    );
  }
}
