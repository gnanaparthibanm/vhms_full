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

  // Get bills by appointment ID
  getBillsByAppointmentId: async (appointmentId) => {
    return await apiClient.get(`/hms/appointments/${appointmentId}/bills`);
  },

  // Create bill
  createBill: async (billData) => {
    return await apiClient.post('/hms/appointments/bills', billData);
  },

  // Update bill
  updateBill: async (id, billData) => {
    return await apiClient.put(`/hms/appointments/bills/${id}`, billData);
  },

  // Delete bill
  deleteBill: async (id) => {
    return await apiClient.delete(`/hms/appointments/bills/${id}`);
  },

  // Payments
  createPayment: async (billId, paymentData) => {
    return await apiClient.post(`/hms/appointments/bills/${billId}/payments`, paymentData);
  },

  getPaymentsByBillId: async (billId) => {
    return await apiClient.get(`/hms/appointments/bills/${billId}/payments`);
  },
};

export default billService;
