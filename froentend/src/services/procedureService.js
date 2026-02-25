import apiClient from '../lib/api';

export const procedureService = {
  // Get all procedures
  getAllProcedures: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/procedures${queryString ? `?${queryString}` : ''}`);
  },

  // Get procedure by ID
  getProcedureById: async (id) => {
    return await apiClient.get(`/hms/appointments/procedures/${id}`);
  },

  // Create procedure
  createProcedure: async (data) => {
    return await apiClient.post('/hms/appointments/procedures', data);
  },

  // Update procedure
  updateProcedure: async (id, data) => {
    return await apiClient.put(`/hms/appointments/procedures/${id}`, data);
  },

  // Delete procedure
  deleteProcedure: async (id) => {
    return await apiClient.delete(`/hms/appointments/procedures/${id}`);
  },
};

export default procedureService;
