import apiClient from '../lib/api';

export const treatmentService = {
  // Get all treatments
  getAllTreatments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/treatments${queryString ? `?${queryString}` : ''}`);
  },

  // Get treatment by ID
  getTreatmentById: async (id) => {
    return await apiClient.get(`/hms/appointments/treatments/${id}`);
  },

  // Create treatment
  createTreatment: async (data) => {
    return await apiClient.post('/hms/appointments/treatments', data);
  },

  // Update treatment
  updateTreatment: async (id, data) => {
    return await apiClient.put(`/hms/appointments/treatments/${id}`, data);
  },

  // Delete treatment
  deleteTreatment: async (id) => {
    return await apiClient.delete(`/hms/appointments/treatments/${id}`);
  },
};

export default treatmentService;
