'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  StarOff,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

interface CryptoPrice {
  usd: number;
  usd_24h_change: number;
}

interface PriceData {
  [key: string]: CryptoPrice;
}

interface CryptoInfo {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

const availableCryptos: { [key: string]: CryptoInfo } = {
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '/logos/btc.svg',
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/logos/eth.svg',
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '/logos/sol.svg',
  },
  cardano: {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    icon: '/logos/ADA.svg',
  },
  tether: {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    icon: '/logos/tether.svg',
  },
};

export default function FavoriteCryptos() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingMode, setIsAddingMode] = useState<boolean>(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');

  // Load favorites from local storage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteCryptos');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Error parsing favorites from localStorage:', e);
      }
    }
  }, []);

  // Save favorites to local storage when they change
  useEffect(() => {
    localStorage.setItem('favoriteCryptos', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch prices on mount and periodically
  useEffect(() => {
    fetchPrices();

    // Update prices every minute
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    if (favorites.length === 0 && !isAddingMode) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/crypto/prices');

      if (!response.ok) {
        throw new Error('Error fetching prices');
      }

      const data = await response.json();
      setPrices(data);
    } catch (e) {
      console.error('Error fetching prices:', e);
      setError('Error loading prices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = () => {
    if (selectedCrypto && !favorites.includes(selectedCrypto)) {
      setFavorites([...favorites, selectedCrypto]);
      setIsAddingMode(false);
      setSelectedCrypto('');
    }
  };

  const removeFavorite = (cryptoId: string) => {
    setFavorites(favorites.filter((id) => id !== cryptoId));
  };

  const startAdding = () => {
    setIsAddingMode(true);
    // Make sure we have fresh prices when adding
    fetchPrices();
  };

  const cancelAdding = () => {
    setIsAddingMode(false);
    setSelectedCrypto('');
  };

  // Get available cryptos that aren't already in favorites
  const availableToAdd = Object.keys(availableCryptos).filter(
    (id) => !favorites.includes(id),
  );
  return (
    <Card className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          Criptomonedas favoritas
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchPrices}
            disabled={isLoading}
            className="text-cyan-400 hover:text-cyan-300"
          >
            <RefreshCw
              size={18}
              className={`${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
          {!isAddingMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startAdding}
              disabled={availableToAdd.length === 0}
              className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300"
            >
              <Star size={18} />
              <span>Añadir</span>
            </Button>
          )}
        </div>
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
          {error}
        </div>
      )}{' '}
      {isAddingMode ? (
        <div className="mb-6 p-4 bg-gray-700/40 rounded-lg border border-gray-600">
          <div className="flex flex-col space-y-4">
            <label className="text-sm font-medium text-white">
              Selecciona una criptomoneda para seguir
            </label>
            <select
              value={selectedCrypto}
              onChange={(e) => setSelectedCrypto(e.target.value)}
              className="p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">Seleccionar criptomoneda</option>
              {availableToAdd.map((id) => (
                <option key={id} value={id}>
                  {availableCryptos[id].name} ({availableCryptos[id].symbol})
                </option>
              ))}
            </select>{' '}
            <div className="flex space-x-3">
              <Button
                onClick={addFavorite}
                disabled={!selectedCrypto}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
              >
                Añadir a favoritos
              </Button>{' '}
              <Button
                variant="outline"
                onClick={cancelAdding}
                className="border border-red-600/70 bg-red-900/30 text-white font-medium hover:bg-red-800/40 hover:border-red-500 transition-colors"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-8 text-center">
          <StarOff className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-white">No tienes criptomonedas favoritas</p>
          <p className="text-gray-400 text-sm mt-1">
            Añade algunas para seguir sus precios
          </p>
          <Button
            onClick={startAdding}
            className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            disabled={availableToAdd.length === 0}
          >
            Añadir criptomonedas
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((cryptoId) => {
            const crypto = availableCryptos[cryptoId];
            const price = prices?.[cryptoId];
            const priceChange = price?.usd_24h_change || 0;
            const isPositive = priceChange >= 0;

            return (
              <motion.div
                key={cryptoId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-4 bg-gray-700/40 rounded-lg hover:bg-gray-700/60 transition-colors border border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src={crypto.icon}
                    alt={crypto.name}
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />{' '}
                  <div>
                    <div className="font-medium text-white">{crypto.name}</div>
                    <div className="text-sm text-gray-300">{crypto.symbol}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  {price ? (
                    <div className="text-right">
                      <div className="font-bold text-white">
                        $
                        {price.usd.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div
                        className={`flex items-center text-sm justify-end ${
                          isPositive ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )}
                        <span>{Math.abs(priceChange).toFixed(2)}%</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">Cargando...</div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFavorite(cryptoId)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
