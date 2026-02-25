import apiClient from '../lib/api';

export const billableItemService = {
  // Get all billable items
  getAllItems: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/ims/billable-items${queryString ? `?${queryString}` : ''}`);
  },

  // Get single billable item
  getItemById: async (id) => {
    return await apiClient.get(`/ims/billable-items/${id}`);
  },

  // Create billable item
  createItem: async (itemData) => {
    return await apiClient.post('/ims/billable-items', itemData);
  },

  // Update billable item
  updateItem: async (id, itemData) => {
    return await apiClient.put(`/ims/billable-items/${id}`, itemData);
  },

  // Delete billable item
  deleteItem: async (id) => {
    return await apiClient.delete(`/ims/billable-items/${id}`);
  },

  // Update stock
  updateStock: async (id, quantity, operation = 'add') => {
    return await apiClient.put(`/ims/billable-items/${id}/stock`, {
      quantity,
      operation
    });
  },
};

export default billableItemService;
