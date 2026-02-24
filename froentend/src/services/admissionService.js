import apiClient from '../lib/api';

export const admissionService = {
  // Admissions
  getAllAdmissions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/admissions${queryString ? `?${queryString}` : ''}`);
  },

  getAdmissionById: async (id) => {
    return await apiClient.get(`/hms/admissions/${id}`);
  },

  createAdmission: async (admissionData) => {
    return await apiClient.post('/hms/admissions', admissionData);
  },

  updateAdmission: async (id, admissionData) => {
    return await apiClient.put(`/hms/admissions/${id}`, admissionData);
  },

  deleteAdmission: async (id) => {
    return await apiClient.delete(`/hms/admissions/${id}`);
  },

  dischargeAdmission: async (id, dischargeData) => {
    return await apiClient.post(`/hms/admissions/${id}/discharge`, dischargeData);
  },

  // Wards
  getAllWards: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/wards${queryString ? `?${queryString}` : ''}`);
  },

  getWardById: async (id) => {
    return await apiClient.get(`/hms/wards/${id}`);
  },

  createWard: async (wardData) => {
    return await apiClient.post('/hms/wards', wardData);
  },

  updateWard: async (id, wardData) => {
    return await apiClient.put(`/hms/wards/${id}`, wardData);
  },

  deleteWard: async (id) => {
    return await apiClient.delete(`/hms/wards/${id}`);
  },

  // Rooms
  getAllRooms: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/rooms${queryString ? `?${queryString}` : ''}`);
  },

  getRoomById: async (id) => {
    return await apiClient.get(`/hms/rooms/${id}`);
  },

  getRoomsByWard: async (wardId) => {
    return await apiClient.get(`/hms/wards/${wardId}/rooms`);
  },

  createRoom: async (roomData) => {
    return await apiClient.post('/hms/rooms', roomData);
  },

  updateRoom: async (id, roomData) => {
    return await apiClient.put(`/hms/rooms/${id}`, roomData);
  },

  deleteRoom: async (id) => {
    return await apiClient.delete(`/hms/rooms/${id}`);
  },

  // Beds
  getAllBeds: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/beds${queryString ? `?${queryString}` : ''}`);
  },

  getBedById: async (id) => {
    return await apiClient.get(`/hms/beds/${id}`);
  },

  getBedsByRoom: async (roomId) => {
    return await apiClient.get(`/hms/rooms/${roomId}/beds`);
  },

  getAvailableBeds: async () => {
    return await apiClient.get('/hms/beds/available');
  },

  createBed: async (bedData) => {
    return await apiClient.post('/hms/beds', bedData);
  },

  updateBed: async (id, bedData) => {
    return await apiClient.put(`/hms/beds/${id}`, bedData);
  },

  deleteBed: async (id) => {
    return await apiClient.delete(`/hms/beds/${id}`);
  },

  // Bed Transfers
  getAllBedTransfers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/bed-transfers${queryString ? `?${queryString}` : ''}`);
  },

  getBedTransferById: async (id) => {
    return await apiClient.get(`/hms/bed-transfers/${id}`);
  },

  createBedTransfer: async (transferData) => {
    return await apiClient.post('/hms/bed-transfers', transferData);
  },
};

export default admissionService;
