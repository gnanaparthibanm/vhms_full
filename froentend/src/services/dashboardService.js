import { apiCall } from './config';

/**
 * Dashboard API Service
 *
 * Backend:
 *   GET /api/v1/hms/dashboard/admindashboard  (Admin, Super Admin)
 *   GET /api/v1/hms/dashboard/labdashboard    (Lab-related roles)
 */
const dashboardService = {
    /**
     * Get admin dashboard stats
     * Returns: today's appointments, revenue, patients, staff counts, alerts, etc.
     */
    getAdminStats: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.allTime !== undefined) queryParams.append('allTime', params.allTime);
        if (params.branchId && params.branchId !== 'all') queryParams.append('branchId', params.branchId);

        const queryString = queryParams.toString();
        const url = `/hms/dashboard/admindashboard${queryString ? `?${queryString}` : ''}`;
        return apiCall(url);
    },

    /**
     * Get lab dashboard stats
     */
    getLabStats: () => apiCall('/hms/dashboard/labdashboard'),
};

export default dashboardService;
