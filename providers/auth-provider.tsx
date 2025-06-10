'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateFavorites: (favoriteCryptos: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  updateFavorites: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cryptoEduUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    setLoading(false);
  }, []); // Login function - connects to MongoDB if email is provided
  const login = async (email: string) => {
    setLoading(true);

    try {
      // First try to find the user by email in MongoDB
      const response = await fetch(
        `/api/users?email=${encodeURIComponent(email)}`,
      );
      let userData: User | null = null;

      if (response.ok) {
        // User exists in MongoDB
        const data = await response.json();
        userData = data.user;
        console.log('Found existing user in MongoDB:', userData);
      } else if (response.status === 404) {
        // User doesn't exist in MongoDB - create a new user
        // Check for existing favorites in localStorage to migrate them
        let initialFavorites: string[] = [];
        const storedFavorites = localStorage.getItem('favoriteCryptos');
        if (storedFavorites) {
          try {
            initialFavorites = JSON.parse(storedFavorites);
          } catch (e) {
            console.error('Error parsing favorites from localStorage:', e);
          }
        }

        // Create new user in MongoDB
        const createResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            favoriteCryptos: initialFavorites,
          }),
        });

        if (createResponse.ok) {
          const data = await createResponse.json();
          userData = data.user;
          console.log('Created new user in MongoDB:', userData);
        } else {
          throw new Error('Failed to create user in MongoDB');
        }
      } else {
        throw new Error(
          `Failed to check user in MongoDB: ${await response.text()}`,
        );
      }
      if (userData) {
        setUser(userData);
        localStorage.setItem('cryptoEduUser', JSON.stringify(userData));
        localStorage.setItem(
          'favoriteCryptos',
          JSON.stringify(userData.favoriteCryptos),
        );
        // Notify components about the login with MongoDB data
        document.dispatchEvent(
          new CustomEvent('user-login-mongodb', {
            detail: { favoriteCryptos: userData.favoriteCryptos },
          }),
        );
      }
    } catch (error) {
      console.error('Login error:', error);

      // Fall back to local storage if MongoDB connection fails
      console.warn('Falling back to local storage for user management');
      const newUser: User = {
        id: Date.now().toString(),
        email: email,
        favoriteCryptos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Check for existing favorites
      const storedFavorites = localStorage.getItem('favoriteCryptos');
      if (storedFavorites) {
        try {
          newUser.favoriteCryptos = JSON.parse(storedFavorites);
        } catch (e) {
          console.error('Error parsing favorites from localStorage:', e);
        }
      }

      setUser(newUser);
      localStorage.setItem('cryptoEduUser', JSON.stringify(newUser));

      throw error;
    } finally {
      setLoading(false);
    }
  }; // Logout function - clears user data and completely resets favorites
  const logout = () => {
    setUser(null);
    localStorage.removeItem('cryptoEduUser');
    // Also clear the favorites in localStorage completely
    localStorage.setItem('favoriteCryptos', JSON.stringify([]));
    // Emit an event to notify components
    document.dispatchEvent(new CustomEvent('user-logout'));
  }; // Update favorites - saves to MongoDB if user exists there
  const updateFavorites = async (favoriteCryptos: string[]) => {
    if (!user) return;

    try {
      // Always update local state first for responsive UI
      const updatedUser = {
        ...user,
        favoriteCryptos,
        updatedAt: new Date().toISOString(),
      };

      setUser(updatedUser);
      localStorage.setItem('cryptoEduUser', JSON.stringify(updatedUser));
      // Also update the local favorites storage for compatibility
      localStorage.setItem('favoriteCryptos', JSON.stringify(favoriteCryptos));

      // If user has a valid ID (not just a timestamp), try to save to MongoDB
      if (user.email && user.email.includes('@')) {
        console.log('Saving favorites to MongoDB for user', user.id);

        const response = await fetch('/api/users/favorites', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            favoriteCryptos,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('MongoDB update failed:', errorText);
          throw new Error(
            `Failed to update favorites in MongoDB: ${errorText}`,
          );
        }

        console.log('Successfully saved favorites to MongoDB');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      // We don't rethrow here - the local state is already updated,
      // so the user experience continues even if the server update fails
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, updateFavorites }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
