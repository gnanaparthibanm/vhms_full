import apiClient from '../lib/api';

export const followupService = {
  // Get all follow-ups
  getAllFollowups: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/followup${queryString ? `?${queryString}` : ''}`);
  },

  // Get follow-up by ID
  getFollowupById: async (id) => {
    return await apiClient.get(`/hms/appointments/followup/${id}`);
  },

  // Create follow-up
  createFollowup: async (data) => {
    return await apiClient.post('/hms/appointments/followup', data);
  },

  // Update follow-up
  updateFollowup: async (id, data) => {
    return await apiClient.put(`/hms/appointments/followup/${id}`, data);
  },

  // Delete follow-up
  deleteFollowup: async (id) => {
    return await apiClient.delete(`/hms/appointments/followup/${id}`);
  },
};

export default followupService;
