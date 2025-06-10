// This file contains utility functions for crypto pricing

// Define the crypto price data type
interface CryptoPriceData {
  [key: string]: {
    usd: number;
    usd_24h_change?: number;
  };
}

// Define the price cache type
interface PriceCache {
  data: CryptoPriceData | null;
  lastUpdate: number;
}

// Cache para almacenar los precios y evitar demasiadas peticiones a la API
let priceCache: PriceCache = {
  data: null,
  lastUpdate: 0,
};

const CACHE_DURATION = 60000; // 1 minuto

// Function to get current crypto prices
export async function getPrices(): Promise<CryptoPriceData> {
  const now = Date.now();

  // Devolver cache si está vigente
  if (priceCache.data && now - priceCache.lastUpdate < CACHE_DURATION) {
    return priceCache.data;
  }

  try {
    // Obtener los precios de las principales criptomonedas
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true',
    );

    if (!response.ok) {
      throw new Error('Error fetching prices');
    }

    const data = await response.json();

    // Actualizar cache
    priceCache = {
      data,
      lastUpdate: now,
    };

    return data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    throw error;
  }
}
