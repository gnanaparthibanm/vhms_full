import apiClient from '../lib/api';

export const billingService = {
  // Bills
  getAllBills: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/billing${queryString ? `?${queryString}` : ''}`);
  },

  getBillById: async (id) => {
    return await apiClient.get(`/ims/billing/${id}`);
  },

  createBill: async (billData) => {
    return await apiClient.post('/ims/billing', billData);
  },

  updateBill: async (id, billData) => {
    return await apiClient.put(`/ims/billing/${id}`, billData);
  },

  deleteBill: async (id) => {
    return await apiClient.delete(`/ims/billing/${id}`);
  },

  // Payments
  createPayment: async (paymentData) => {
    return await apiClient.post('/ims/billing/payment', paymentData);
  },

  getPaymentsByBill: async (billId) => {
    return await apiClient.get(`/ims/billing/${billId}/payments`);
  },

  // POS specific
  createPOSSale: async (saleData) => {
    return await apiClient.post('/ims/billing/pos', saleData);
  },

  // Dashboard/Reports
  getBillingDashboard: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/dashboard${queryString ? `?${queryString}` : ''}`);
  },

  getBillingReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/report${queryString ? `?${queryString}` : ''}`);
  },
};

export default billingService;
