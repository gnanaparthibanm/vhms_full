import apiClient from '../lib/api';

export const prescriptionService = {
  // Get all prescriptions
  getAllPrescriptions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/prescriptions${queryString ? `?${queryString}` : ''}`);
  },

  // Get prescription by ID
  getPrescriptionById: async (id) => {
    return await apiClient.get(`/hms/appointments/prescriptions/${id}`);
  },

  // Create prescription
  createPrescription: async (data) => {
    return await apiClient.post('/hms/appointments/prescriptions', data);
  },

  // Update prescription
  updatePrescription: async (id, data) => {
    return await apiClient.put(`/hms/appointments/prescriptions/${id}`, data);
  },

  // Delete prescription
  deletePrescription: async (id) => {
    return await apiClient.delete(`/hms/appointments/prescriptions/${id}`);
  },
};

export default prescriptionService;
