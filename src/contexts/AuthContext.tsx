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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved token on load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    const fetchMe = async (currentToken: string) => {
      try {
        const res = await fetch('/api/me', {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (res.ok) {
          const freshUser = await res.json();
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
          
          if (freshUser.preferences) {
            try {
              const prefs = JSON.parse(freshUser.preferences);
              if (prefs.theme) {
                if (prefs.theme === 'default') {
                  document.body.removeAttribute('data-theme');
                } else {
                  document.body.setAttribute('data-theme', prefs.theme);
                }
              }
            } catch (e) {}
          }
        } else {
          // Token might be invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      fetchMe(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
