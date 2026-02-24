import apiClient from '../lib/api';

export const treatmentService = {
  // Get all treatments
  getAllTreatments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/treatment${queryString ? `?${queryString}` : ''}`);
  },

  // Get treatment by ID
  getTreatmentById: async (id) => {
    return await apiClient.get(`/hms/appointments/treatment/${id}`);
  },

  // Create treatment
  createTreatment: async (data) => {
    return await apiClient.post('/hms/appointments/treatment', data);
  },

  // Update treatment
  updateTreatment: async (id, data) => {
    return await apiClient.put(`/hms/appointments/treatment/${id}`, data);
  },

  // Delete treatment
  deleteTreatment: async (id) => {
    return await apiClient.delete(`/hms/appointments/treatment/${id}`);
  },
};

export default treatmentService;
