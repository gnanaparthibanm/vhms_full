import apiClient from '../lib/api';

export const prescriptionService = {
  // Get all prescriptions
  getAllPrescriptions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/prescription${queryString ? `?${queryString}` : ''}`);
  },

  // Get prescription by ID
  getPrescriptionById: async (id) => {
    return await apiClient.get(`/hms/appointments/prescription/${id}`);
  },

  // Create prescription
  createPrescription: async (data) => {
    return await apiClient.post('/hms/appointments/prescription', data);
  },

  // Update prescription
  updatePrescription: async (id, data) => {
    return await apiClient.put(`/hms/appointments/prescription/${id}`, data);
  },

  // Delete prescription
  deletePrescription: async (id) => {
    return await apiClient.delete(`/hms/appointments/prescription/${id}`);
  },
};

export default prescriptionService;
