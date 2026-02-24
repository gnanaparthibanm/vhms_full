import apiClient from '../lib/api';

export const procedureService = {
  // Get all procedures
  getAllProcedures: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/procedure${queryString ? `?${queryString}` : ''}`);
  },

  // Get procedure by ID
  getProcedureById: async (id) => {
    return await apiClient.get(`/hms/appointments/procedure/${id}`);
  },

  // Create procedure
  createProcedure: async (data) => {
    return await apiClient.post('/hms/appointments/procedure', data);
  },

  // Update procedure
  updateProcedure: async (id, data) => {
    return await apiClient.put(`/hms/appointments/procedure/${id}`, data);
  },

  // Delete procedure
  deleteProcedure: async (id) => {
    return await apiClient.delete(`/hms/appointments/procedure/${id}`);
  },
};

export default procedureService;
