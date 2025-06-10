import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { config } from '@/config/openai.config';
import Parser from 'rss-parser';

const parser = new Parser();
const openai = createOpenAI({
  apiKey: config.openai.apiKey,
});

const NEWS_SOURCES = [
  {
    url: 'https://cointelegraph.com/rss',
    name: 'CoinTelegraph'
  },
  {
    url: 'https://decrypt.co/feed',
    name: 'Decrypt'
  },
  {
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    name: 'CoinDesk'
  }
];

const SYSTEM_PROMPT = `Eres un experto en criptomonedas y blockchain. Tu tarea es resumir la siguiente noticia en español, siguiendo estas pautas:

1. El resumen debe tener 2-3 oraciones.
2. Mantén los términos técnicos importantes.
3. Enfócate en los hechos más relevantes.
4. Usa un tono profesional pero accesible.
5. Si hay cifras o estadísticas importantes, inclúyelas.
6. Evita opiniones o especulaciones.

Resume la siguiente noticia:`;

export async function GET() {
  try {
    const allNews = [];

    // Obtener noticias de todas las fuentes en paralelo
    const newsPromises = NEWS_SOURCES.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        return feed.items.slice(0, 3).map((item) => ({
          title: item.title || '',
          link: item.link || '',
          pubDate: item.pubDate || '',
          content: item.content || item.title || '',
          source: source.name
        }));
      } catch (error) {
        console.error(`Error fetching news from ${source.name}:`, error);
        return [];
      }
    });

    const results = await Promise.all(newsPromises);
    const items = results.flat();

    // Ordenar por fecha más reciente
    items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    // Tomar los 5 más recientes y generar resúmenes
    for (const item of items.slice(0, 5)) {
      try {
        const { text: summary } = await generateText({
          model: openai('gpt-3.5-turbo'),
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: item.content
            }
          ],
          temperature: 0.5,
        });

        allNews.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          summary,
          source: item.source
        });
      } catch (error) {
        console.error('Error generating summary:', error);
      }
    }

    return NextResponse.json(allNews);
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    return NextResponse.json(
      { error: 'Error fetching news' },
      { status: 500 }
    );
  }
} 