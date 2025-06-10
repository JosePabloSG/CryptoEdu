import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_SECRET_KEY,
});

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a crypto market analyst. Analyze current market conditions and provide sentiment analysis, predictions, and confidence levels."
        },
        {
          role: "user",
          content: "Analyze current crypto market conditions and provide sentiment score, analysis, and prediction."
        }
      ]
    });

    const analysis = completion.choices[0].message.content;

    // Parse AI response to create structured data
    const sentiment = {
      score: 0.65, // Example score, should be derived from analysis
      analysis: analysis || "Análisis del mercado basado en tendencias actuales y datos históricos.",
      prediction: "Se espera una tendencia alcista en las próximas 24 horas.",
      confidence: 0.75
    };

    return NextResponse.json(sentiment);
  } catch (error) {
    return NextResponse.json(
      { error: "Error analyzing market sentiment" },
      { status: 500 }
    );
  }
}
