'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketSentiment {
  score: number;
  analysis: string;
  prediction: string;
  confidence: number;
}

export default function MarketAnalysis() {
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/market-sentiment');
      const data = await response.json();

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      setSentiment(data);
    } catch (error) {
      console.error('Error analyzing market sentiment:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6 text-emerald-500" />
        <h3 className="text-xl font-semibold">Análisis de Mercado con IA</h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : sentiment ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
            <span className="text-gray-300">Sentimiento del mercado:</span>
            <span className={`font-semibold ${sentiment.score > 0.5 ? 'text-emerald-400' : 'text-red-400'}`}>
              {sentiment.score > 0.5 ? 'Positivo' : 'Negativo'} ({(sentiment.score * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-xl">
            <p className="text-gray-300">{sentiment.analysis}</p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <p className="text-gray-300">{sentiment.prediction}</p>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-8">
          <Button
            onClick={analyzeSentiment}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            Analizar mercado
          </Button>
          <p className="text-sm text-gray-400 mt-4">Powered by OpenAI</p>
        </div>
      )}
    </div>
  );
}
