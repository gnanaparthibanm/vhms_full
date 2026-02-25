import apiClient from '../lib/api';

export const settingsService = {
  // ============ TAX RATES ============
  getAllTaxRates: (params = {}) => {
    return apiClient.get('/ims/settings/tax-rates', { params });
  },

  getTaxRateById: (id) => {
    return apiClient.get(`/ims/settings/tax-rates/${id}`);
  },

  createTaxRate: (data) => {
    return apiClient.post('/ims/settings/tax-rates', data);
  },

  updateTaxRate: (id, data) => {
    return apiClient.put(`/ims/settings/tax-rates/${id}`, data);
  },

  deleteTaxRate: (id) => {
    return apiClient.delete(`/ims/settings/tax-rates/${id}`);
  },

  // ============ DISCOUNTS ============
  getAllDiscounts: (params = {}) => {
    return apiClient.get('/ims/settings/discounts', { params });
  },

  getDiscountById: (id) => {
    return apiClient.get(`/ims/settings/discounts/${id}`);
  },

  createDiscount: (data) => {
    return apiClient.post('/ims/settings/discounts', data);
  },

  updateDiscount: (id, data) => {
    return apiClient.put(`/ims/settings/discounts/${id}`, data);
  },

  deleteDiscount: (id) => {
    return apiClient.delete(`/ims/settings/discounts/${id}`);
  },

  // ============ PAYMENT METHODS ============
  getAllPaymentMethods: (params = {}) => {
    return apiClient.get('/ims/settings/payment-methods', { params });
  },

  getPaymentMethodById: (id) => {
    return apiClient.get(`/ims/settings/payment-methods/${id}`);
  },

  createPaymentMethod: (data) => {
    return apiClient.post('/ims/settings/payment-methods', data);
  },

  updatePaymentMethod: (id, data) => {
    return apiClient.put(`/ims/settings/payment-methods/${id}`, data);
  },

  deletePaymentMethod: (id) => {
    return apiClient.delete(`/ims/settings/payment-methods/${id}`);
  },

  // ============ CATEGORIES ============
  getAllCategories: (params = {}) => {
    return apiClient.get('/ims/settings/categories', { params });
  },

  getCategoryById: (id) => {
    return apiClient.get(`/ims/settings/categories/${id}`);
  },

  createCategory: (data) => {
    return apiClient.post('/ims/settings/categories', data);
  },

  updateCategory: (id, data) => {
    return apiClient.put(`/ims/settings/categories/${id}`, data);
  },

  deleteCategory: (id) => {
    return apiClient.delete(`/ims/settings/categories/${id}`);
  },
};

export default settingsService;
