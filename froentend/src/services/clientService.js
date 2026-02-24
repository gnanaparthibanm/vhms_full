import apiClient from '../lib/api';

export const clientService = {
  // ==================== CLIENTS ====================
  
  // Get all clients
  getAllClients: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/clients/client${queryString ? `?${queryString}` : ''}`);
  },

  // Get client by ID
  getClientById: async (id) => {
    return await apiClient.get(`/hms/clients/client/${id}`);
  },

  // Get client history
  getClientHistory: async (id) => {
    return await apiClient.get(`/hms/clients/client/${id}/history`);
  },

  // Create client (with user account)
  createClient: async (clientData) => {
    return await apiClient.post('/hms/clients/client', clientData);
  },

  // Update client
  updateClient: async (id, clientData) => {
    return await apiClient.put(`/hms/clients/client/${id}`, clientData);
  },

  // Delete client (soft delete)
  deleteClient: async (id) => {
    return await apiClient.delete(`/hms/clients/client/${id}`);
  },

  // Restore client
  restoreClient: async (id) => {
    return await apiClient.patch(`/hms/clients/client/${id}/restore`);
  },
};

export default clientService;
