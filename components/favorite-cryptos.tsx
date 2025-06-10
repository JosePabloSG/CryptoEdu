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
  UserRound,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import UserLogin from './user-login';

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
  const { user, updateFavorites } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingMode, setIsAddingMode] = useState<boolean>(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Load favorites based on auth state
  useEffect(() => {
    if (user) {
      // When logged in, use user's favorites from the user object
      setFavorites(user.favoriteCryptos || []);
    } else {
      // When not logged in, fall back to local storage
      const storedFavorites = localStorage.getItem('favoriteCryptos');
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites));
        } catch (e) {
          console.error('Error parsing favorites from localStorage:', e);
        }
      }
    }
  }, [user]);

  // Handle login/logout events for resetting favorites
  useEffect(() => {
    // When MongoDB data becomes available after login
    const handleMongoLogin = (e: CustomEvent) => {
      const { favoriteCryptos } = (
        e as CustomEvent<{ favoriteCryptos: string[] }>
      ).detail;
      setFavorites(favoriteCryptos || []);
      setError('✓ Cargados favoritos desde MongoDB');
      setTimeout(() => setError(null), 3000);
    };
    // When user logs out
    const handleLogout = () => {
      // Reset favorites to empty array when logging out
      setFavorites([]);
      // Make sure localStorage is also cleared
      localStorage.setItem('favoriteCryptos', JSON.stringify([]));
      setError('Sesión cerrada. Favoritos reseteados.');
      setTimeout(() => setError(null), 3000);
      // Refresh prices to clear UI
      setPrices(null);
    };

    // Add event listeners
    document.addEventListener(
      'user-login-mongodb',
      handleMongoLogin as EventListener,
    );
    document.addEventListener('user-logout', handleLogout);

    // Cleanup
    return () => {
      document.removeEventListener(
        'user-login-mongodb',
        handleMongoLogin as EventListener,
      );
      document.removeEventListener('user-logout', handleLogout);
    };
  }, []);

  // Save favorites based on auth state
  useEffect(() => {
    if (!user) {
      // If not logged in, save to local storage
      localStorage.setItem('favoriteCryptos', JSON.stringify(favorites));
    }
  }, [favorites, user]);

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
  const syncWithDatabase = async () => {
    if (!user) return;

    setIsSyncing(true);
    try {
      await updateFavorites(favorites);
      setError(null);
      // Show a temporary success message
      const prevError = error;
      setError('✓ Favoritos sincronizados correctamente con MongoDB');
      setTimeout(() => {
        // Clear the success message after 3 seconds unless there's a new error
        setError((currentError) =>
          currentError === '✓ Favoritos sincronizados correctamente con MongoDB'
            ? null
            : currentError,
        );
      }, 3000);
    } catch (e) {
      console.error('Error syncing with database:', e);
      setError('Error al sincronizar con MongoDB. Por favor intenta de nuevo.');
    } finally {
      setIsSyncing(false);
    }
  };

  const addFavorite = async () => {
    if (selectedCrypto && !favorites.includes(selectedCrypto)) {
      const newFavorites = [...favorites, selectedCrypto];
      setFavorites(newFavorites);
      setIsAddingMode(false);
      setSelectedCrypto('');

      // Sync with database if logged in
      if (user) {
        try {
          await updateFavorites(newFavorites);
        } catch (e) {
          console.error('Error saving favorites:', e);
          setError(
            'Error al guardar favoritos. Los cambios son locales por ahora.',
          );
        }
      }
    }
  };

  const removeFavorite = async (cryptoId: string) => {
    const newFavorites = favorites.filter((id) => id !== cryptoId);
    setFavorites(newFavorites);

    // Sync with database if logged in
    if (user) {
      try {
        await updateFavorites(newFavorites);
      } catch (e) {
        console.error('Error removing favorite:', e);
        setError(
          'Error al eliminar favorito. Los cambios son locales por ahora.',
        );
      }
    }
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
      {' '}
      <div className="flex items-center justify-between mb-4">
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
            title="Actualizar precios"
          >
            <RefreshCw
              size={18}
              className={`${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={syncWithDatabase}
              disabled={isSyncing}
              className="text-indigo-400 hover:text-indigo-300"
              title="Sincronizar con base de datos"
            >
              <Database
                size={18}
                className={`${isSyncing ? 'animate-pulse' : ''}`}
              />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFavorites([]);
              if (user) {
                updateFavorites([]);
              } else {
                localStorage.setItem('favoriteCryptos', JSON.stringify([]));
              }
              setError('Lista de favoritos reseteada');
              setTimeout(() => setError(null), 3000);
            }}
            disabled={favorites.length === 0}
            className="text-red-400 hover:text-red-300"
            title="Resetear favoritos"
          >
            <Trash2 size={18} />
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
      </div>{' '}
      {/* User login section */}
      <div className="mb-6 text-center">
        {' '}
        <div className="mb-2 text-sm text-white/70">
          {user ? (
            <>
              Sesión iniciada como{' '}
              <span className="font-medium text-cyan-300">{user.email}</span>
              <div className="text-xs text-white/50 mt-1">
                Tus favoritos se guardarán en MongoDB automáticamente
              </div>
              {favorites.length === 0 && (
                <div className="text-xs text-amber-400/90 mt-1 font-medium">
                  Tu lista de favoritos está vacía. Añade algunas criptomonedas.
                </div>
              )}
            </>
          ) : (
            <>
              {favorites.length > 0 ? (
                'Inicia sesión para guardar tus favoritos en MongoDB'
              ) : (
                <>
                  <span className="text-amber-400/90 font-medium">
                    No hay favoritos seleccionados
                  </span>
                  <div className="text-white/70 mt-1">
                    Inicia sesión para acceder a tus favoritos en MongoDB
                  </div>
                </>
              )}
              <div className="text-xs text-white/50 mt-1">
                Sin sesión, tus favoritos solo se guardan localmente
              </div>
            </>
          )}
        </div>
        <UserLogin />
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
