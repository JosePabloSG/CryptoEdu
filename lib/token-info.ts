// Mapeo de símbolos comunes a IDs de CoinGecko
export const commonTokens: { [key: string]: string } = {
  btc: 'bitcoin',
  eth: 'ethereum',
  sol: 'solana',
  ada: 'cardano',
  bnb: 'binancecoin',
  xrp: 'ripple',
  doge: 'dogecoin',
  dot: 'polkadot',
  matic: 'matic-network',
  link: 'chainlink',
  usdt: 'tether',
  usdc: 'usd-coin',
  dai: 'dai',
};

export async function getTokenPrice(query: string) {
  // Normalizar la consulta
  const normalizedQuery = query.toLowerCase().trim();

  // Determinar el ID del token
  let tokenId = commonTokens[normalizedQuery] || normalizedQuery;

  try {
    const response = await fetch(`/api/crypto/prices`);
    if (!response.ok) throw new Error('Error fetching prices');

    const prices = await response.json();

    if (!prices[tokenId]) {
      return `Lo siento, no pude encontrar el precio de ${query}. Por favor, verifica que el nombre o símbolo sea correcto.`;
    }

    const price = prices[tokenId].usd;
    const change24h = prices[tokenId].usd_24h_change;
    const changeSymbol = change24h >= 0 ? '↗️' : '↘️';

    return `El precio actual de ${query.toUpperCase()} es $${price.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )} USD. Cambio 24h: ${changeSymbol} ${Math.abs(change24h).toFixed(2)}%`;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return `Lo siento, hubo un error al obtener el precio de ${query}.`;
  }
}

export async function convertCrypto(amount: number, from: string, to: string) {
  // Normalizar las consultas
  const normalizedFrom = from.toLowerCase().trim();
  const normalizedTo = to.toLowerCase().trim();

  // Determinar los IDs de los tokens
  let fromId = commonTokens[normalizedFrom] || normalizedFrom;
  let toId = commonTokens[normalizedTo] || normalizedTo;

  // Manejar 'usd', 'dólares', etc.
  if (
    ['usd', 'dollar', 'dolar', 'dólar', 'dólares', 'dolares'].includes(fromId)
  ) {
    fromId = 'usd';
  }

  if (
    ['usd', 'dollar', 'dolar', 'dólar', 'dólares', 'dolares'].includes(toId)
  ) {
    toId = 'usd';
  }

  try {
    const response = await fetch(
      `/api/crypto/convert?from=${fromId}&to=${toId}&amount=${amount}`,
    );

    if (!response.ok) throw new Error('Error converting currencies');

    const data = await response.json();

    // Formateamos el resultado dependiendo de la moneda de destino
    let formattedResult;
    if (toId === 'usd') {
      formattedResult = `$${data.result.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else {
      // Para criptomonedas, el formato depende del valor
      if (data.result < 0.001) {
        formattedResult = data.result.toFixed(8);
      } else if (data.result < 1) {
        formattedResult = data.result.toFixed(6);
      } else {
        formattedResult = data.result.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        });
      }
    }

    // Resolución elegante de símbolos
    const fromSymbol =
      fromId === 'usd'
        ? 'USD'
        : commonTokens[fromId]
        ? fromId.toUpperCase()
        : fromId.toUpperCase();

    const toSymbol =
      toId === 'usd'
        ? 'USD'
        : commonTokens[toId]
        ? toId.toUpperCase()
        : toId.toUpperCase();

    return `${amount} ${fromSymbol} equivale a ${formattedResult} ${toSymbol}`;
  } catch (error) {
    console.error('Error converting currencies:', error);
    return `Lo siento, hubo un error al convertir de ${from} a ${to}.`;
  }
}

export async function getTokenInformation(query: string) {
  // Normalizar la consulta
  const normalizedQuery = query.toLowerCase().trim();

  // Determinar el ID del token
  let tokenId = commonTokens[normalizedQuery] || normalizedQuery;

  try {
    const response = await fetch(`/api/crypto/token-info?id=${tokenId}`);
    if (!response.ok) throw new Error('Token not found');

    const data = await response.json();

    // Formatear la información de manera educativa
    return formatTokenInfo(data);
  } catch (error) {
    return `Lo siento, no pude encontrar información sobre ese token. Por favor, verifica que el nombre o símbolo sea correcto.`;
  }
}

function formatTokenInfo(data: any) {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const formatSupplyInfo = () => {
    let supply = [];
    if (data.market_data.circulating_supply) {
      supply.push(
        `Circulante: ${formatNumber(data.market_data.circulating_supply)} ${
          data.symbol
        }`,
      );
    }
    if (data.market_data.total_supply) {
      supply.push(
        `Total: ${formatNumber(data.market_data.total_supply)} ${data.symbol}`,
      );
    }
    if (data.market_data.max_supply) {
      supply.push(
        `Máximo: ${formatNumber(data.market_data.max_supply)} ${data.symbol}`,
      );
    }
    return supply.join('\n');
  };

  return `
# ${data.name} (${data.symbol})

## 📊 Datos de Mercado
- Precio: $${data.market_data.current_price.usd.toLocaleString()}
- Capitalización: $${formatNumber(data.market_data.market_cap.usd)}
- Volumen 24h: $${formatNumber(data.market_data.total_volume.usd)}

## 💰 Información de Suministro
${formatSupplyInfo()}

## 👥 Métricas de Comunidad
${
  data.community_data.twitter_followers
    ? `- Twitter: ${formatNumber(
        data.community_data.twitter_followers,
      )} seguidores`
    : ''
}
${
  data.community_data.reddit_subscribers
    ? `- Reddit: ${formatNumber(
        data.community_data.reddit_subscribers,
      )} subscriptores`
    : ''
}
${
  data.community_data.telegram_channel_user_count
    ? `- Telegram: ${formatNumber(
        data.community_data.telegram_channel_user_count,
      )} usuarios`
    : ''
}

## 👨‍💻 Actividad de Desarrollo
${
  data.developer_data.commit_count_4_weeks
    ? `- Commits (4 semanas): ${data.developer_data.commit_count_4_weeks}`
    : ''
}
${data.developer_data.forks ? `- Forks: ${data.developer_data.forks}` : ''}
${data.developer_data.stars ? `- Stars: ${data.developer_data.stars}` : ''}
${
  data.developer_data.pull_requests_merged
    ? `- PRs merged: ${data.developer_data.pull_requests_merged}`
    : ''
}
${
  data.developer_data.pull_request_contributors
    ? `- Contribuidores: ${data.developer_data.pull_request_contributors}`
    : ''
}

## 🔗 Enlaces Importantes
${data.links.homepage[0] ? `- Sitio web: ${data.links.homepage[0]}` : ''}
${
  data.links.blockchain_site[0]
    ? `- Explorer: ${data.links.blockchain_site[0]}`
    : ''
}
${
  data.links.twitter_screen_name
    ? `- Twitter: https://twitter.com/${data.links.twitter_screen_name}`
    : ''
}
${
  data.links.telegram_channel_identifier
    ? `- Telegram: https://t.me/${data.links.telegram_channel_identifier}`
    : ''
}
${
  data.links.github && data.links.github[0]
    ? `- GitHub: ${data.links.github[0]}`
    : ''
}

## 📝 Descripción
${
  data.description
    ? data.description.split('.')[0] + '.'
    : 'No hay descripción disponible.'
}

_Nota: Toda esta información es educativa y no constituye asesoría financiera. Siempre realiza tu propia investigación._
`;
}
