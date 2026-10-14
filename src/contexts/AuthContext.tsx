import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: number;
  email: string;
  name: string | null;
  preferences?: string | null;
  githubLinked?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Synchronously initialize token and user from localStorage so there is ZERO delay or loading screen!
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Set isLoading to false immediately to prevent any startup loading screens
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) return;

    // Apply cached theme preferences immediately
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.preferences) {
          const prefs = JSON.parse(parsed.preferences);
          if (prefs.theme) {
            if (prefs.theme === 'default') {
              document.body.removeAttribute('data-theme');
            } else {
              document.body.setAttribute('data-theme', prefs.theme);
            }
          }
        }
      }
    } catch (e) {}

    // Verify token with backend in background WITHOUT blocking the user interface
    const verifySession = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const res = await fetch('/api/me', {
          headers: { 'Authorization': `Bearer ${currentToken}` },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const freshUser = await res.json();
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } else if (res.status === 401) {
          // Token is genuinely invalid or expired on backend
          console.warn("Session expired on server, logging out");
          logout();
        }
        // If status is 500, 502, 503, 504, DO NOT log out! Render is just cold starting.
      } catch (err) {
        // Network timeout / cold start error -> keep user logged in with cached session!
        console.info("Backend temporarily unreachable (cold start / offline). Preserving active session.");
      }
    };

    verifySession();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    try {
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('last_view', 'dashboard');
    } catch (e) {}
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('last_view');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
