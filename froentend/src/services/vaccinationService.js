import apiClient from '../lib/api';

export const vaccinationService = {
  // Get all vaccinations
  getAllVaccinations: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/vaccination${queryString ? `?${queryString}` : ''}`);
  },

  // Get vaccination by ID
  getVaccinationById: async (id) => {
    return await apiClient.get(`/hms/appointments/vaccination/${id}`);
  },

  // Create vaccination
  createVaccination: async (data) => {
    return await apiClient.post('/hms/appointments/vaccination', data);
  },

  // Update vaccination
  updateVaccination: async (id, data) => {
    return await apiClient.put(`/hms/appointments/vaccination/${id}`, data);
  },

  // Delete vaccination
  deleteVaccination: async (id) => {
    return await apiClient.delete(`/hms/appointments/vaccination/${id}`);
  },
};

export default vaccinationService;
