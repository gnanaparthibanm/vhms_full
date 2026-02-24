import apiClient from '../lib/api';

export const laboratoryService = {
  // Lab Test Master
  getAllLabTests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/laboratory/tests${queryString ? `?${queryString}` : ''}`);
  },

  getLabTestById: async (id) => {
    return await apiClient.get(`/hms/laboratory/tests/${id}`);
  },

  createLabTest: async (testData) => {
    return await apiClient.post('/hms/laboratory/tests', testData);
  },

  updateLabTest: async (id, testData) => {
    return await apiClient.put(`/hms/laboratory/tests/${id}`, testData);
  },

  deleteLabTest: async (id) => {
    return await apiClient.delete(`/hms/laboratory/tests/${id}`);
  },

  // Lab Test Orders
  getAllLabOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/laboratory/orders${queryString ? `?${queryString}` : ''}`);
  },

  getLabOrderById: async (id) => {
    return await apiClient.get(`/hms/laboratory/orders/${id}`);
  },

  getLabOrdersByAppointment: async (appointmentId) => {
    return await apiClient.get(`/hms/appointments/${appointmentId}/lab-orders`);
  },

  createLabOrder: async (orderData) => {
    return await apiClient.post('/hms/laboratory/orders', orderData);
  },

  updateLabOrder: async (id, orderData) => {
    return await apiClient.put(`/hms/laboratory/orders/${id}`, orderData);
  },

  deleteLabOrder: async (id) => {
    return await apiClient.delete(`/hms/laboratory/orders/${id}`);
  },

  // Lab Results
  updateLabResults: async (orderId, resultsData) => {
    return await apiClient.put(`/hms/laboratory/orders/${orderId}/results`, resultsData);
  },

  getLabResults: async (orderId) => {
    return await apiClient.get(`/hms/laboratory/orders/${orderId}/results`);
  },

  // Radiology Orders
  getAllRadiologyOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/laboratory/radiology${queryString ? `?${queryString}` : ''}`);
  },

  getRadiologyOrderById: async (id) => {
    return await apiClient.get(`/hms/laboratory/radiology/${id}`);
  },

  createRadiologyOrder: async (orderData) => {
    return await apiClient.post('/hms/laboratory/radiology', orderData);
  },

  updateRadiologyOrder: async (id, orderData) => {
    return await apiClient.put(`/hms/laboratory/radiology/${id}`, orderData);
  },

  deleteRadiologyOrder: async (id) => {
    return await apiClient.delete(`/hms/laboratory/radiology/${id}`);
  },
};

export default laboratoryService;
