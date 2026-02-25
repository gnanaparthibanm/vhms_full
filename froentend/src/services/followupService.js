import apiClient from '../lib/api';

export const followupService = {
  // Get all follow-ups
  getAllFollowups: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/appointments/followups${queryString ? `?${queryString}` : ''}`);
  },

  // Get follow-up by ID
  getFollowupById: async (id) => {
    return await apiClient.get(`/hms/appointments/followups/${id}`);
  },

  // Create follow-up
  createFollowup: async (data) => {
    return await apiClient.post('/hms/appointments/followups', data);
  },

  // Update follow-up
  updateFollowup: async (id, data) => {
    return await apiClient.put(`/hms/appointments/followups/${id}`, data);
  },

  // Delete follow-up
  deleteFollowup: async (id) => {
    return await apiClient.delete(`/hms/appointments/followups/${id}`);
  },
};

export default followupService;
