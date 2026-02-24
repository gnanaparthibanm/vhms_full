import apiClient from '../lib/api';

export const authService = {
  // Login
  login: async (credentials) => {
    // Backend expects 'identifier' instead of 'email'
    const loginData = {
      identifier: credentials.email || credentials.identifier,
      password: credentials.password
    };
    
    const response = await apiClient.post('/user/login', loginData);
    
    // Store token and user data
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Register
  register: async (userData) => {
    return await apiClient.post('/user/register', userData);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Forgot password
  forgotPassword: async (email) => {
    return await apiClient.post('/user/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return await apiClient.post('/user/reset-password', { token, password });
  },
};

export default authService;
