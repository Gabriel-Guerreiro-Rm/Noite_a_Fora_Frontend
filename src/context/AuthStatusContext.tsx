import React, { createContext, useContext, useEffect, useState } from 'react';
import { decodeTokenStatus } from '../api/auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  status: 'ACTIVE' | 'INACTIVE' | null;
  isReady: boolean;
  clientId: string | null;
  logout: () => void;
}

const AuthStatusContext = createContext<AuthContextType | undefined>(undefined);

export const AuthStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<AuthContextType['status']>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decoded = decodeTokenStatus(token);
      
      if (decoded) {
        setIsAuthenticated(true);
        setStatus(decoded.status as 'ACTIVE' | 'INACTIVE');
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setClientId(tokenPayload.sub);
      } else {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
    setIsReady(true);
  }, []);
  
  const logout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setStatus(null);
      setClientId(null);
      navigate('/login');
  };

  return (
    <AuthStatusContext.Provider value={{ isAuthenticated, status, isReady, clientId, logout }}>
      {children}
    </AuthStatusContext.Provider>
  );
};

export const useAuthStatus = () => {
  const context = useContext(AuthStatusContext);
  if (context === undefined) {
    throw new Error('useAuthStatus must be used within an AuthStatusProvider');
  }
  return context;
};