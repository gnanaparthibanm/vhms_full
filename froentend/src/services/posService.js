import apiClient from '../lib/api';

export const posService = {
    // Get all billable items for POS (products, services, medications)
    getAllItems: (params) => apiClient.get('/ims/billable-items', { params }),

    // Create a POS sale
    createSale: (data) => apiClient.post('/ims/pos', data),

    // Get all sales
    getAllSales: (params) => apiClient.get('/ims/pos', { params }),

    // Get single sale by ID
    getSaleById: (id) => apiClient.get(`/ims/pos/${id}`),

    // Update sale
    updateSale: (id, data) => apiClient.put(`/ims/pos/${id}`, data),

    // Delete sale
    deleteSale: (id) => apiClient.delete(`/ims/pos/${id}`),

    // Get payment methods
    getPaymentMethods: () => apiClient.get('/ims/settings/payment-methods', { params: { limit: 100 } }),

    // Get tax rates
    getTaxRates: () => apiClient.get('/ims/settings/tax-rates', { params: { limit: 100 } }),

    // Get discounts
    getDiscounts: () => apiClient.get('/ims/settings/discounts', { params: { limit: 100 } }),
};
