import apiClient from '../lib/api';

export const reportsService = {
    // Get report statistics (monthly & yearly breakdown)
    getReportStats: (params) => apiClient.get('/ims/reports/stats', { params }),

    // Get top customers
    getTopCustomers: (params) => apiClient.get('/ims/reports/top-customers', { params }),

    // Get item type breakdown (Medication, Product, Service)
    getItemTypeBreakdown: (params) => apiClient.get('/ims/reports/item-type-breakdown', { params }),

    // Get payment method breakdown
    getPaymentMethodBreakdown: (params) => apiClient.get('/ims/reports/payment-method-breakdown', { params }),

    // Get top selling items
    getTopSellingItems: (params) => apiClient.get('/ims/reports/top-selling-items', { params }),

    // Get sales trend (daily sales for a month)
    getSalesTrend: (params) => apiClient.get('/ims/reports/sales-trend', { params }),

    // Get dashboard summary
    getDashboardSummary: (params) => apiClient.get('/ims/reports/dashboard-summary', { params }),
};

export default reportsService;
