'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MarketTrend {
  symbol: string;
  percentage: number;
  direction: 'up' | 'down';
  prediction: string;
}

export default function MarketAnalysisSection() {
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch('/api/market-sentiment');
        const data = await response.json();
        setTrends(data.trends);
      } catch (error) {
        console.error('Error fetching market analysis:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
    const interval = setInterval(fetchAnalysis, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-900/30 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="inline-flex items-center space-x-2 bg-emerald-500/10 rounded-full px-4 py-2 mb-4"
          >
            <Brain className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Análisis con IA</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Análisis de Mercado</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Análisis en tiempo real del mercado cripto potenciado por inteligencia artificial
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-3 flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            </div>
          ) : (
            trends.map((trend) => (
              <motion.div
                key={trend.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold">{trend.symbol}/USD</span>
                  <div className={`flex items-center ${trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                    {trend.direction === 'up' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span className="ml-1 font-semibold">
                      {trend.percentage}%
                    </span>
                  </div>
                </div>
                <p className="text-gray-300">{trend.prediction}</p>
                <div className="mt-4 text-xs text-gray-500">
                  Powered by OpenAI
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
