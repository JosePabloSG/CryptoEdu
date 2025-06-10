'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Database, Fingerprint, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/providers/auth-provider';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 bg-gray-800/70 hover:bg-gray-700/80 transition-colors rounded-lg border border-gray-700"
      >
        <User size={18} className="text-cyan-400" />
        <span className="text-sm text-white font-medium">Mi cuenta</span>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute top-full right-0 mt-2 w-72 z-50"
        >
          <Card className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 p-4 shadow-xl">
            <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-700">
              <div className="rounded-full bg-cyan-900/50 border border-cyan-700/50 p-2">
                <Fingerprint size={24} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-white font-medium">Usuario</div>
                <div className="text-sm text-gray-400 truncate max-w-[180px]">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="mb-4 pb-3 border-b border-gray-700">
              <div className="flex items-center space-x-3 mb-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-white text-sm">Cuenta activa</span>
              </div>
              <div className="flex items-center space-x-3">
                <Database size={16} className="text-indigo-400" />
                <span className="text-white text-sm">
                  {user.favoriteCryptos?.length || 0} criptomonedas favoritas
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full border-red-600/70 bg-red-900/30 text-white hover:bg-red-800/40 hover:border-red-500"
              onClick={logout}
            >
              <LogOut size={16} className="mr-2" />
              Cerrar sesión
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
