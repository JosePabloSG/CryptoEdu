'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CryptoPrice {
  usd: number;
  usd_24h_change: number;
}

interface PriceData {
  [key: string]: CryptoPrice;
}

const cryptoConfig = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '/logos/btc.svg'
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/logos/eth.svg'
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    icon: '/logos/sol.svg'
  },
  cardano: {
    name: 'Cardano',
    symbol: 'ADA',
    icon: '/logos/ADA.svg' // Placeholder, update with actual Cardano logo
  }
};

export default function PriceTicker() {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/crypto/prices');
        if (!response.ok) throw new Error('Error fetching prices');
        const data = await response.json();
        setPrices(data);
      } catch (e) {
        setError('Error loading prices');
        console.error(e);
      }
    };

    // Fetch inicial
    fetchPrices();

    // Actualizar cada minuto
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="bg-gray-800/50 text-red-400 p-2 rounded-lg text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {prices && Object.entries(cryptoConfig).map(([id, config]) => {
          const price = prices[id];
          if (!price) return null;

          const priceChange = price.usd_24h_change;
          const isPositive = priceChange >= 0;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col space-y-2 p-3 rounded-lg hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Image
                  src={config.icon}
                  alt={config.name}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-medium">{config.symbol}</span>
              </div>

              <div className="text-lg font-bold">
                ${price.usd.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>

              <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span>{Math.abs(priceChange).toFixed(2)}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
