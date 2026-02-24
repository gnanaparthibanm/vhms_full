import apiClient from '../lib/api';

export const billService = {
  // Get all bills
  getAllBills: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/bill${queryString ? `?${queryString}` : ''}`);
  },

  // Get bill by ID
  getBillById: async (id) => {
    return await apiClient.get(`/hms/appointments/bill/${id}`);
  },

  // Create bill
  createBill: async (data) => {
    return await apiClient.post('/hms/appointments/bill', data);
  },

  // Update bill
  updateBill: async (id, data) => {
    return await apiClient.put(`/hms/appointments/bill/${id}`, data);
  },

  // Delete bill
  deleteBill: async (id) => {
    return await apiClient.delete(`/hms/appointments/bill/${id}`);
  },
};

export default billService;
