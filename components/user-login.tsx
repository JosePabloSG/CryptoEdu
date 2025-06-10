'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/providers/auth-provider';

export default function UserLogin() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setIsLoggingIn(true);
    setError(null);

    try {
      await login(email);
      setShowLogin(false);
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo nuevamente.');
      console.error('Login error:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };
  const handleLogout = () => {
    // Clear favorites first - this will ensure the component sees empty favorites immediately
    localStorage.setItem('favoriteCryptos', JSON.stringify([]));
    // Then logout to trigger additional cleanup
    logout();
  };

  if (user) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700 flex items-center">
        <div className="flex-1">
          <div className="text-sm text-gray-400">Conectado como</div>
          <div className="text-white font-medium truncate max-w-[200px]">
            {user.email}
          </div>
        </div>{' '}
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="border border-red-600/70 bg-red-900/30 text-white font-medium hover:bg-red-800/50 hover:border-red-500 transition-colors"
        >
          Salir
        </Button>
      </Card>
    );
  }
  return (
    <div>
      {!showLogin ? (
        <Button
          variant="outline"
          onClick={() => setShowLogin(true)}
          className="flex items-center space-x-2 border-2 border-cyan-500 bg-cyan-900/40 text-white hover:bg-cyan-800/60 py-6 px-4 text-base font-medium shadow-md shadow-cyan-900/20"
        >
          <LogIn size={20} />
          <span>Iniciar sesión para guardar favoritos</span>
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4"
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-700">
            <form onSubmit={handleLogin} className="flex flex-col space-y-3">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm text-white font-medium block mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full p-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              {error && (
                <div className="p-2 bg-red-900/20 border border-red-700 rounded text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium"
                >
                  {isLoggingIn ? 'Iniciando...' : 'Iniciar sesión'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLogin(false)}
                  className="border border-red-600/70 bg-red-900/30 text-white font-medium hover:bg-red-800/40 hover:border-red-500 transition-colors"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
