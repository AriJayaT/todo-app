// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Check token validity on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const user = await AuthService.verifyToken(token);
          setCurrentUser(user);
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  // Authentication functions
  const login = async (email, password) => {
    const { user, token } = await AuthService.loginWithEmailAndPassword(email, password);
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem('authToken', token);
    return user;
  };

  const register = async (name, email, password) => {
    const { user, token } = await AuthService.registerWithEmailAndPassword(name, email, password);
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem('authToken', token);
    return user;
  };

  const loginWithGoogle = async (googleUser) => {
    const { user, token } = await AuthService.loginWithGoogle(googleUser);
    setCurrentUser(user);
    setToken(token);
    localStorage.setItem('authToken', token);
    return user;
  };

  const logout = async () => {
    await AuthService.logout(token);
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const resetPassword = async (email) => {
    return await AuthService.sendPasswordReset(email);
  };

  const value = {
    currentUser,
    token,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}