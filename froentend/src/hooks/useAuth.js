import { useState, useEffect } from 'react';
import { authService } from '../services';

/**
 * Custom hook for authentication
 * @returns {Object} - { user, isAuthenticated, login, logout, loading }
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: authService.isAuthenticated(),
    login,
    logout,
    loading,
  };
};

export default useAuth;
