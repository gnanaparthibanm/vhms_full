import apiClient from '../lib/api';

export const inventoryService = {
  // Products
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/product/product${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: async (id) => {
    return await apiClient.get(`/ims/product/product/${id}`);
  },

  createProduct: async (productData) => {
    return await apiClient.post('/ims/product/product', productData);
  },

  updateProduct: async (id, productData) => {
    return await apiClient.put(`/ims/product/product/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await apiClient.delete(`/ims/product/product/${id}`);
  },

  // Stock
  getAllStock: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/stock${queryString ? `?${queryString}` : ''}`);
  },

  getStockById: async (id) => {
    return await apiClient.get(`/ims/stock/${id}`);
  },

  updateStock: async (id, stockData) => {
    return await apiClient.put(`/ims/stock/${id}`, stockData);
  },

  // Categories
  getAllCategories: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/product/category${queryString ? `?${queryString}` : ''}`);
  },

  createCategory: async (categoryData) => {
    return await apiClient.post('/ims/product/category', categoryData);
  },

  // Vendors
  getAllVendors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/vendor${queryString ? `?${queryString}` : ''}`);
  },

  createVendor: async (vendorData) => {
    return await apiClient.post('/ims/vendor', vendorData);
  },

  // Inward (Stock In)
  getAllInwards: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/inward${queryString ? `?${queryString}` : ''}`);
  },

  createInward: async (inwardData) => {
    return await apiClient.post('/ims/inward', inwardData);
  },

  // Orders
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/order${queryString ? `?${queryString}` : ''}`);
  },

  createOrder: async (orderData) => {
    return await apiClient.post('/ims/order', orderData);
  },

  // Returns
  getAllReturns: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/return${queryString ? `?${queryString}` : ''}`);
  },

  createReturn: async (returnData) => {
    return await apiClient.post('/ims/return', returnData);
  },
};

export default inventoryService;
