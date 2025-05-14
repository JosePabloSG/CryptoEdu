import { NextResponse } from 'next/server';

// Cache para almacenar la información y evitar demasiadas peticiones
let tokenInfoCache: { [key: string]: { data: any, timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

async function getTokenInfo(id: string) {
  // Verificar cache
  if (
    tokenInfoCache[id] &&
    Date.now() - tokenInfoCache[id].timestamp < CACHE_DURATION
  ) {
    return tokenInfoCache[id].data;
  }

  try {
    // Obtener información básica del token
    const [infoResponse, marketResponse] = await Promise.all([
      fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=true&developer_data=true&sparkline=false`),
      fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30&interval=daily`)
    ]);

    if (!infoResponse.ok || !marketResponse.ok) {
      throw new Error('Error fetching token data');
    }

    const [info, marketData] = await Promise.all([
      infoResponse.json(),
      marketResponse.json()
    ]);

    // Procesar y estructurar la información relevante
    const processedData = {
      id: info.id,
      symbol: info.symbol.toUpperCase(),
      name: info.name,
      description: info.description.en,
      market_data: {
        current_price: info.market_data.current_price,
        market_cap: info.market_data.market_cap,
        total_volume: info.market_data.total_volume,
        circulating_supply: info.market_data.circulating_supply,
        total_supply: info.market_data.total_supply,
        max_supply: info.market_data.max_supply,
      },
      community_data: {
        twitter_followers: info.community_data.twitter_followers,
        reddit_subscribers: info.community_data.reddit_subscribers,
        telegram_channel_user_count: info.community_data.telegram_channel_user_count,
      },
      developer_data: {
        forks: info.developer_data.forks,
        stars: info.developer_data.stars,
        subscribers: info.developer_data.subscribers,
        total_issues: info.developer_data.total_issues,
        closed_issues: info.developer_data.closed_issues,
        pull_requests_merged: info.developer_data.pull_requests_merged,
        pull_request_contributors: info.developer_data.pull_request_contributors,
        commit_count_4_weeks: info.developer_data.commit_count_4_weeks,
      },
      links: {
        homepage: info.links.homepage,
        blockchain_site: info.links.blockchain_site,
        official_forum_url: info.links.official_forum_url,
        chat_url: info.links.chat_url,
        announcement_url: info.links.announcement_url,
        twitter_screen_name: info.links.twitter_screen_name,
        telegram_channel_identifier: info.links.telegram_channel_identifier,
        github: info.links.repos_url.github,
      },
      price_history: marketData.prices,
      market_caps: marketData.market_caps,
      total_volumes: marketData.total_volumes,
    };

    // Guardar en cache
    tokenInfoCache[id] = {
      data: processedData,
      timestamp: Date.now()
    };

    return processedData;
  } catch (error) {
    console.error('Error fetching token info:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get('id');

    if (!tokenId) {
      return NextResponse.json(
        { error: 'Token ID is required' },
        { status: 400 }
      );
    }

    const tokenInfo = await getTokenInfo(tokenId);
    return NextResponse.json(tokenInfo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching token information' },
      { status: 500 }
    );
  }
}
