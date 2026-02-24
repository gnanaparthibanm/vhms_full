import apiClient from '../lib/api';

export const inventoryService = {
  // Products
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/products${queryString ? `?${queryString}` : ''}`);
  },

  getProductById: async (id) => {
    return await apiClient.get(`/ims/products/${id}`);
  },

  createProduct: async (productData) => {
    return await apiClient.post('/ims/products', productData);
  },

  updateProduct: async (id, productData) => {
    return await apiClient.put(`/ims/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await apiClient.delete(`/ims/products/${id}`);
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

  getLowStockItems: async () => {
    return await apiClient.get('/ims/stock/low-stock');
  },

  // Vendors
  getAllVendors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/vendors${queryString ? `?${queryString}` : ''}`);
  },

  getVendorById: async (id) => {
    return await apiClient.get(`/ims/vendors/${id}`);
  },

  createVendor: async (vendorData) => {
    return await apiClient.post('/ims/vendors', vendorData);
  },

  updateVendor: async (id, vendorData) => {
    return await apiClient.put(`/ims/vendors/${id}`, vendorData);
  },

  deleteVendor: async (id) => {
    return await apiClient.delete(`/ims/vendors/${id}`);
  },

  // Orders
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/orders${queryString ? `?${queryString}` : ''}`);
  },

  getOrderById: async (id) => {
    return await apiClient.get(`/ims/orders/${id}`);
  },

  createOrder: async (orderData) => {
    return await apiClient.post('/ims/orders', orderData);
  },

  updateOrder: async (id, orderData) => {
    return await apiClient.put(`/ims/orders/${id}`, orderData);
  },

  deleteOrder: async (id) => {
    return await apiClient.delete(`/ims/orders/${id}`);
  },

  // Inward
  getAllInward: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/inward${queryString ? `?${queryString}` : ''}`);
  },

  getInwardById: async (id) => {
    return await apiClient.get(`/ims/inward/${id}`);
  },

  createInward: async (inwardData) => {
    return await apiClient.post('/ims/inward', inwardData);
  },

  updateInward: async (id, inwardData) => {
    return await apiClient.put(`/ims/inward/${id}`, inwardData);
  },

  // Billing
  getAllBillings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/billing${queryString ? `?${queryString}` : ''}`);
  },

  getBillingById: async (id) => {
    return await apiClient.get(`/ims/billing/${id}`);
  },

  createBilling: async (billingData) => {
    return await apiClient.post('/ims/billing', billingData);
  },

  updateBilling: async (id, billingData) => {
    return await apiClient.put(`/ims/billing/${id}`, billingData);
  },
};

export default inventoryService;
