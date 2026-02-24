import apiClient from '../lib/api';

export const petService = {
  // ==================== PETS ====================
  
  // Get all pets
  getAllPets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiClient.get(`/hms/clients/pet${queryString ? `?${queryString}` : ''}`);
  },

  // Get pet by ID
  getPetById: async (id) => {
    return await apiClient.get(`/hms/clients/pet/${id}`);
  },

  // Get pets by client ID
  getPetsByClient: async (clientId) => {
    return await apiClient.get(`/hms/clients/pet?client_id=${clientId}`);
  },

  // Create pet
  createPet: async (petData) => {
    return await apiClient.post('/hms/clients/pet', petData);
  },

  // Update pet
  updatePet: async (id, petData) => {
    return await apiClient.put(`/hms/clients/pet/${id}`, petData);
  },

  // Delete pet (soft delete)
  deletePet: async (id) => {
    return await apiClient.delete(`/hms/clients/pet/${id}`);
  },

  // Restore pet
  restorePet: async (id) => {
    return await apiClient.patch(`/hms/clients/pet/${id}/restore`);
  },
};

export default petService;
