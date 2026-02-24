import apiClient from '../lib/api';

export const dashboardService = {
  // Get dashboard statistics
  getDashboardStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/dashboard/stats${queryString ? `?${queryString}` : ''}`);
  },

  // Get recent appointments
  getRecentAppointments: async (limit = 10) => {
    return await apiClient.get(`/hms/dashboard/recent-appointments?limit=${limit}`);
  },

  // Get upcoming appointments
  getUpcomingAppointments: async (limit = 10) => {
    return await apiClient.get(`/hms/dashboard/upcoming-appointments?limit=${limit}`);
  },

  // Get revenue statistics
  getRevenueStats: async (startDate, endDate) => {
    return await apiClient.get(`/hms/dashboard/revenue?startDate=${startDate}&endDate=${endDate}`);
  },

  // Get patient statistics
  getPatientStats: async () => {
    return await apiClient.get('/hms/dashboard/patient-stats');
  },
};

export default dashboardService;
