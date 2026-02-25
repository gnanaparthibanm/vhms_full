import apiClient from '../lib/api';

export const productService = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/product/product${queryString ? `?${queryString}` : ''}`);
  },

  // Get product by ID
  getProductById: async (id) => {
    return await apiClient.get(`/ims/product/product/${id}`);
  },

  // Get prescription products only
  getPrescriptionProducts: async () => {
    return await apiClient.get('/ims/product/product/prescription/list');
  },
};

export default productService;
