import apiClient from '../lib/api';

export const recordsService = {
    // ==================== RECORD TYPES ====================

    // Get all record types
    getAllRecordTypes: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiClient.get(`/hms/types${queryString ? `?${queryString}` : ''}`);
    },

    // Get record type by ID
    getRecordTypeById: async (id) => {
        return await apiClient.get(`/hms/types/${id}`);
    },

    // Create record type
    createRecordType: async (typeData) => {
        return await apiClient.post('/hms/types', typeData);
    },

    // Update record type
    updateRecordType: async (id, typeData) => {
        return await apiClient.put(`/hms/types/${id}`, typeData);
    },

    // Delete record type
    deleteRecordType: async (id) => {
        return await apiClient.delete(`/hms/types/${id}`);
    },

    // ==================== RECORD TEMPLATES ====================

    // Get all templates
    getAllTemplates: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiClient.get(`/hms/templates${queryString ? `?${queryString}` : ''}`);
    },

    // Get template by ID
    getTemplateById: async (id) => {
        return await apiClient.get(`/hms/templates/${id}`);
    },

    // Create template
    createTemplate: async (templateData) => {
        return await apiClient.post('/hms/templates', templateData);
    },

    // Update template
    updateTemplate: async (id, templateData) => {
        return await apiClient.put(`/hms/templates/${id}`, templateData);
    },

    // Delete template
    deleteTemplate: async (id) => {
        return await apiClient.delete(`/hms/templates/${id}`);
    },

    // ==================== MEDICAL RECORDS ====================

    // Get all records
    getAllRecords: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return await apiClient.get(`/hms/records${queryString ? `?${queryString}` : ''}`);
    },

    // Get record by ID
    getRecordById: async (id) => {
        return await apiClient.get(`/hms/records/${id}`);
    },

    // Create record
    createRecord: async (recordData) => {
        return await apiClient.post('/hms/records', recordData);
    },

    // Update record
    updateRecord: async (id, recordData) => {
        return await apiClient.put(`/hms/records/${id}`, recordData);
    },

    // Delete record
    deleteRecord: async (id) => {
        return await apiClient.delete(`/hms/records/${id}`);
    },
};

export default recordsService;
