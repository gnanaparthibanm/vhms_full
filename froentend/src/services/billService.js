import apiClient from '../lib/api';

export const billService = {
  // Get all bills
  getAllBills: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/bills${queryString ? `?${queryString}` : ''}`);
  },

  // Get bill by ID
  getBillById: async (id) => {
    return await apiClient.get(`/hms/appointments/bills/${id}`);
  },

  // Create bill
  createBill: async (data) => {
    return await apiClient.post('/hms/appointments/bills', data);
  },

  // Update bill
  updateBill: async (id, data) => {
    return await apiClient.put(`/hms/appointments/bills/${id}`, data);
  },

  // Delete bill
  deleteBill: async (id) => {
    return await apiClient.delete(`/hms/appointments/bills/${id}`);
  },
};

export default billService;
