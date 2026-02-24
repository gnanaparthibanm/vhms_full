import apiClient from '../lib/api';

export const hospitalService = {
  // ==================== DEPARTMENTS ====================
  
  // Get all departments
  getAllDepartments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/hospital/department${queryString ? `?${queryString}` : ''}`);
  },

  // Get department by ID
  getDepartmentById: async (id) => {
    return await apiClient.get(`/hms/hospital/department/${id}`);
  },

  // Create department
  createDepartment: async (data) => {
    return await apiClient.post('/hms/hospital/department', data);
  },

  // Update department
  updateDepartment: async (id, data) => {
    return await apiClient.put(`/hms/hospital/department/${id}`, data);
  },

  // Delete department (soft delete)
  deleteDepartment: async (id) => {
    return await apiClient.delete(`/hms/hospital/department/${id}`);
  },

  // Restore department
  restoreDepartment: async (id) => {
    return await apiClient.patch(`/hms/hospital/department/${id}/restore`);
  },

  // ==================== DESIGNATIONS ====================
  
  // Get all designations
  getAllDesignations: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/hospital/designation${queryString ? `?${queryString}` : ''}`);
  },

  // Get designation by ID
  getDesignationById: async (id) => {
    return await apiClient.get(`/hms/hospital/designation/${id}`);
  },

  // Create designation
  createDesignation: async (data) => {
    return await apiClient.post('/hms/hospital/designation', data);
  },

  // Update designation
  updateDesignation: async (id, data) => {
    return await apiClient.put(`/hms/hospital/designation/${id}`, data);
  },

  // Delete designation (soft delete)
  deleteDesignation: async (id) => {
    return await apiClient.delete(`/hms/hospital/designation/${id}`);
  },

  // Restore designation
  restoreDesignation: async (id) => {
    return await apiClient.patch(`/hms/hospital/designation/${id}/restore`);
  },
};

export default hospitalService;
