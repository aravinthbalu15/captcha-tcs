
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean, captchaAnswer: string, captchaExpected: number) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string, captchaAnswer: string, captchaExpected: number) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          if (response.success) {
            setUser(response.user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean, captchaAnswer: string, captchaExpected: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.login(email, password, captchaAnswer, captchaExpected);
      
      if (response.success) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', response.token);
        setUser(response.user);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const signup = async (name: string, email: string, password: string, captchaAnswer: string, captchaExpected: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.signup(name, email, password, captchaAnswer, captchaExpected);
      
      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
