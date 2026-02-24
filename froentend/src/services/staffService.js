import apiClient from '../lib/api';

export const staffService = {
  // ==================== DOCTORS ====================
  
  // Get all doctors
  getAllDoctors: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/staff/doctor${queryString ? `?${queryString}` : ''}`);
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    return await apiClient.get(`/hms/staff/doctor/${id}`);
  },

  // Create doctor (with user and staff profile)
  createDoctor: async (data) => {
    return await apiClient.post('/hms/staff/doctor', data);
  },

  // Update doctor
  updateDoctor: async (id, data) => {
    return await apiClient.put(`/hms/staff/doctor/${id}`, data);
  },

  // Delete doctor (soft delete)
  deleteDoctor: async (id) => {
    return await apiClient.delete(`/hms/staff/doctor/${id}`);
  },

  // Restore doctor
  restoreDoctor: async (id) => {
    return await apiClient.patch(`/hms/staff/doctor/${id}/restore`);
  },

  // ==================== NURSES ====================
  
  // Get all nurses
  getAllNurses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/staff/nurse${queryString ? `?${queryString}` : ''}`);
  },

  // Get nurse by ID
  getNurseById: async (id) => {
    return await apiClient.get(`/hms/staff/nurse/${id}`);
  },

  // Create nurse (with user and staff profile)
  createNurse: async (data) => {
    return await apiClient.post('/hms/staff/nurse', data);
  },

  // Update nurse
  updateNurse: async (id, data) => {
    return await apiClient.put(`/hms/staff/nurse/${id}`, data);
  },

  // Delete nurse (soft delete)
  deleteNurse: async (id) => {
    return await apiClient.delete(`/hms/staff/nurse/${id}`);
  },

  // Restore nurse
  restoreNurse: async (id) => {
    return await apiClient.patch(`/hms/staff/nurse/${id}/restore`);
  },

  // ==================== RECEPTIONISTS ====================
  
  // Get all receptionists
  getAllReceptionists: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/staff/receptionist${queryString ? `?${queryString}` : ''}`);
  },

  // Get receptionist by ID
  getReceptionistById: async (id) => {
    return await apiClient.get(`/hms/staff/receptionist/${id}`);
  },

  // Create receptionist (with user and staff profile)
  createReceptionist: async (data) => {
    return await apiClient.post('/hms/staff/receptionist', data);
  },

  // Update receptionist
  updateReceptionist: async (id, data) => {
    return await apiClient.put(`/hms/staff/receptionist/${id}`, data);
  },

  // Delete receptionist (soft delete)
  deleteReceptionist: async (id) => {
    return await apiClient.delete(`/hms/staff/receptionist/${id}`);
  },

  // Restore receptionist
  restoreReceptionist: async (id) => {
    return await apiClient.patch(`/hms/staff/receptionist/${id}/restore`);
  },

  // ==================== PHARMACISTS ====================
  
  // Get all pharmacists
  getAllPharmacists: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/staff/pharmacist${queryString ? `?${queryString}` : ''}`);
  },

  // Get pharmacist by ID
  getPharmacistById: async (id) => {
    return await apiClient.get(`/hms/staff/pharmacist/${id}`);
  },

  // Create pharmacist (with user and staff profile)
  createPharmacist: async (data) => {
    return await apiClient.post('/hms/staff/pharmacist', data);
  },

  // Update pharmacist
  updatePharmacist: async (id, data) => {
    return await apiClient.put(`/hms/staff/pharmacist/${id}`, data);
  },

  // Delete pharmacist (soft delete)
  deletePharmacist: async (id) => {
    return await apiClient.delete(`/hms/staff/pharmacist/${id}`);
  },

  // Restore pharmacist
  restorePharmacist: async (id) => {
    return await apiClient.patch(`/hms/staff/pharmacist/${id}/restore`);
  },

  // ==================== LAB TECHNICIANS ====================
  
  // Get all lab technicians
  getAllLabTechnicians: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/staff/labtechnician${queryString ? `?${queryString}` : ''}`);
  },

  // Get lab technician by ID
  getLabTechnicianById: async (id) => {
    return await apiClient.get(`/hms/staff/labtechnician/${id}`);
  },

  // Create lab technician (with user and staff profile)
  createLabTechnician: async (data) => {
    return await apiClient.post('/hms/staff/labtechnician', data);
  },

  // Update lab technician
  updateLabTechnician: async (id, data) => {
    return await apiClient.put(`/hms/staff/labtechnician/${id}`, data);
  },

  // Delete lab technician (soft delete)
  deleteLabTechnician: async (id) => {
    return await apiClient.delete(`/hms/staff/labtechnician/${id}`);
  },

  // Restore lab technician
  restoreLabTechnician: async (id) => {
    return await apiClient.patch(`/hms/staff/labtechnician/${id}/restore`);
  },

  // ==================== ACCOUNTANTS ====================
  
  // Get all accountants
  getAllAccountants: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/staff/accountant${queryString ? `?${queryString}` : ''}`);
  },

  // Get accountant by ID
  getAccountantById: async (id) => {
    return await apiClient.get(`/hms/staff/accountant/${id}`);
  },

  // Create accountant (with user and staff profile)
  createAccountant: async (data) => {
    return await apiClient.post('/hms/staff/accountant', data);
  },

  // Update accountant
  updateAccountant: async (id, data) => {
    return await apiClient.put(`/hms/staff/accountant/${id}`, data);
  },

  // Delete accountant (soft delete)
  deleteAccountant: async (id) => {
    return await apiClient.delete(`/hms/staff/accountant/${id}`);
  },

  // Restore accountant
  restoreAccountant: async (id) => {
    return await apiClient.patch(`/hms/staff/accountant/${id}/restore`);
  },

  // ==================== STAFF PROFILES ====================
  
  // Get all staff profiles
  getAllStaffProfiles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/staff/staffprofile${queryString ? `?${queryString}` : ''}`);
  },

  // Get staff profile by ID
  getStaffProfileById: async (id) => {
    return await apiClient.get(`/hms/staff/staffprofile/${id}`);
  },

  // Create staff profile
  createStaffProfile: async (data) => {
    return await apiClient.post('/hms/staff/staffprofile', data);
  },

  // Update staff profile
  updateStaffProfile: async (id, data) => {
    return await apiClient.put(`/hms/staff/staffprofile/${id}`, data);
  },

  // Delete staff profile (soft delete)
  deleteStaffProfile: async (id) => {
    return await apiClient.delete(`/hms/staff/staffprofile/${id}`);
  },
};

export default staffService;
