'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
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

interface CryptoConfigType {
  [key: string]: {
    name: string;
    symbol: string;
    icon: string;
  };
}

const cryptoConfig: CryptoConfigType = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '/logos/btc.svg',
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '/logos/eth.svg',
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    icon: '/logos/sol.svg',
  },
  cardano: {
    name: 'Cardano',
    symbol: 'ADA',
    icon: '/logos/ADA.svg',
  },
  tether: {
    name: 'Tether',
    symbol: 'USDT',
    icon: '/logos/tether.svg',
  },
};

export default function CryptoConverter() {
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [fromCrypto, setFromCrypto] = useState<string>('bitcoin');
  const [toCrypto, setToCrypto] = useState<string>('usd');
  const [conversionResult, setConversionResult] = useState<number | null>(null);
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch crypto prices on mount and when crypto selection changes
  useEffect(() => {
    fetchPrices();
  }, [fromCrypto, toCrypto]);

  const fetchPrices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/crypto/prices');

      if (!response.ok) {
        throw new Error('Error fetching prices');
      }

      const data = await response.json();
      setPrices(data);

      // Calculate conversion after fetching prices
      if (fromAmount) {
        calculateConversion(fromAmount, fromCrypto, toCrypto, data);
      }
    } catch (e) {
      console.error('Error fetching prices:', e);
      setError('Error loading prices. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateConversion = (
    amount: string,
    from: string,
    to: string,
    priceData: PriceData | null = prices,
  ) => {
    if (!amount || isNaN(parseFloat(amount)) || !priceData) {
      setConversionResult(null);
      return;
    }

    const numAmount = parseFloat(amount);

    // If converting to USD
    if (to === 'usd') {
      if (from in priceData) {
        setConversionResult(numAmount * priceData[from].usd);
      }
      return;
    }

    // If converting from USD
    if (from === 'usd') {
      if (to in priceData) {
        setConversionResult(numAmount / priceData[to].usd);
      }
      return;
    }

    // If converting between cryptos
    if (from in priceData && to in priceData) {
      const fromUsd = numAmount * priceData[from].usd;
      setConversionResult(fromUsd / priceData[to].usd);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    calculateConversion(value, fromCrypto, toCrypto);
  };

  const handleFromCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFromCrypto(value);
    calculateConversion(fromAmount, value, toCrypto);
  };

  const handleToCryptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setToCrypto(value);
    calculateConversion(fromAmount, fromCrypto, value);
  };

  const swapCurrencies = () => {
    // Only swap if both are cryptos or if one is USD
    if (
      (fromCrypto !== 'usd' && toCrypto !== 'usd') ||
      fromCrypto === 'usd' ||
      toCrypto === 'usd'
    ) {
      const temp = fromCrypto;
      setFromCrypto(toCrypto);
      setToCrypto(temp);
      // Recalculation will happen via useEffect
    }
  };

  const formatNumber = (value: number): string => {
    if (value < 0.001) {
      return value.toFixed(8);
    } else if (value < 1) {
      return value.toFixed(4);
    } else if (value < 1000) {
      return value.toFixed(2);
    } else {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };
  return (
    <Card className="w-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">
          Convertidor de criptomonedas
        </h3>
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
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* From Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">De</label>
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="number"
                value={fromAmount}
                onChange={handleAmountChange}
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="0.00"
                min="0"
              />
            </div>
            <select
              value={fromCrypto}
              onChange={handleFromCryptoChange}
              className="p-3 rounded-lg border border-gray-600 bg-gray-800 text-white w-36 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="usd">USD</option>
              {Object.entries(cryptoConfig).map(([id, { name, symbol }]) => (
                <option key={`from-${id}`} value={id}>
                  {symbol}
                </option>
              ))}
            </select>{' '}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={swapCurrencies}
            className="rounded-full bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-400 p-2 h-10 w-10 border border-cyan-600/40 shadow-lg hover:shadow-cyan-500/20"
          >
            <ArrowRightLeft />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">A</label>
          <div className="flex space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={
                  conversionResult !== null
                    ? formatNumber(conversionResult)
                    : ''
                }
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="0.00"
                readOnly
              />
            </div>
            <select
              value={toCrypto}
              onChange={handleToCryptoChange}
              className="p-3 rounded-lg border border-gray-600 bg-gray-800 text-white w-36 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="usd">USD</option>
              {Object.entries(cryptoConfig).map(([id, { name, symbol }]) => (
                <option key={`to-${id}`} value={id}>
                  {symbol}
                </option>
              ))}
            </select>{' '}
          </div>
        </div>

        {/* Info Box */}
        {prices && fromCrypto !== 'usd' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 p-3 rounded-lg bg-gray-700/40 text-sm text-white border border-gray-600"
          >
            <div className="flex items-center space-x-2">
              {fromCrypto in cryptoConfig && (
                <Image
                  src={cryptoConfig[fromCrypto].icon}
                  alt={cryptoConfig[fromCrypto].name}
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              )}
              <span>
                1{' '}
                {fromCrypto in cryptoConfig
                  ? cryptoConfig[fromCrypto].symbol
                  : fromCrypto.toUpperCase()}{' '}
                ={' '}
              </span>
              <span className="font-medium text-white">
                $
                {prices[fromCrypto]?.usd.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
