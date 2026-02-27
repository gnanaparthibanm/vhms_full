// API Configuration
// export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/api/v1';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vhms-full.onrender.com/api/v1';

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
