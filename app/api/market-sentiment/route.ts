import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET_KEY,
});

async function getCurrentPrices() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 } // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Validar que tenemos todos los datos necesarios
    const requiredCoins = ['bitcoin', 'ethereum', 'solana'];
    for (const coin of requiredCoins) {
      if (!data[coin] || typeof data[coin].usd_24h_change !== 'number') {
        throw new Error(`Datos faltantes o inválidos para ${coin}`);
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw new Error('No se pudieron obtener los precios actuales');
  }
}

export async function GET(request: Request) {
  try {
    if (!process.env.OPENAI_API_SECRET_KEY) {
      throw new Error('OPENAI_API_SECRET_KEY no está configurada');
    }

    const prices = await getCurrentPrices();

    const prompt = `
      Analiza las siguientes variaciones de precio en las últimas 24 horas:
      BTC: ${prices.bitcoin.usd_24h_change.toFixed(2)}%
      ETH: ${prices.ethereum.usd_24h_change.toFixed(2)}%
      SOL: ${prices.solana.usd_24h_change.toFixed(2)}%
      
      Proporciona un análisis técnico breve y una predicción para cada uno.
      Responde en formato JSON con la siguiente estructura exacta:
      {
        "trends": [
          {
            "symbol": "BTC",
            "percentage": number,
            "direction": "up" | "down",
            "prediction": "string (máximo 100 caracteres)"
          },
          {
            "symbol": "ETH",
            "percentage": number,
            "direction": "up" | "down",
            "prediction": "string (máximo 100 caracteres)"
          },
          {
            "symbol": "SOL",
            "percentage": number,
            "direction": "up" | "down",
            "prediction": "string (máximo 100 caracteres)"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un analista experto en mercados crypto. Proporciona análisis técnicos concisos y realistas. DEBES responder con un objeto JSON que contenga un array 'trends' con exactamente 3 elementos para BTC, ETH y SOL."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{"trends": []}');
    
    if (!analysis.trends || !Array.isArray(analysis.trends) || analysis.trends.length === 0) {
      throw new Error('Formato de respuesta inválido de OpenAI');
    }

    return Response.json({ trends: analysis.trends });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Error analyzing market sentiment",
        details: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}
