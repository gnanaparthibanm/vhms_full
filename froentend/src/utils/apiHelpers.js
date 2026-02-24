/**
 * API Helper Utilities
 * Common functions for API operations
 */

/**
 * Format error messages from API responses
 * @param {Object} error - Error object from API
 * @returns {string} - Formatted error message
 */
export const formatApiError = (error) => {
  if (error.errors && error.errors.length > 0) {
    return error.errors.map(err => `${err.field}: ${err.message}`).join(', ');
  }
  return error.message || 'An unexpected error occurred';
};

/**
 * Build query string from params object
 * @param {Object} params - Query parameters
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
  return new URLSearchParams(filtered).toString();
};

/**
 * Format date for API requests
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string (YYYY-MM-DD)
 */
export const formatDateForApi = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Format datetime for API requests
 * @param {Date|string} datetime - Datetime to format
 * @returns {string} - Formatted datetime string (YYYY-MM-DDTHH:mm:ss)
 */
export const formatDateTimeForApi = (datetime) => {
  if (!datetime) return '';
  const d = new Date(datetime);
  return d.toISOString().slice(0, 19);
};

/**
 * Parse API date to local format
 * @param {string} dateString - Date string from API
 * @returns {string} - Formatted date for display
 */
export const parseApiDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Parse API datetime to local format
 * @param {string} datetimeString - Datetime string from API
 * @returns {string} - Formatted datetime for display
 */
export const parseApiDateTime = (datetimeString) => {
  if (!datetimeString) return '';
  const date = new Date(datetimeString);
  return date.toLocaleString();
};

/**
 * Handle file upload
 * @param {File} file - File to upload
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Upload response
 */
export const uploadFile = async (file, endpoint) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('File upload failed');
  }

  return response.json();
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate form data before submission
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateFormData = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${field} must be less than ${rule.maxLength} characters`;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} is invalid`;
    }

    if (rule.custom && value) {
      const customError = rule.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Paginate array data
 * @param {Array} data - Data to paginate
 * @param {number} page - Current page (1-indexed)
 * @param {number} pageSize - Items per page
 * @returns {Object} - { data: Array, totalPages: number, currentPage: number }
 */
export const paginateData = (data, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / pageSize);

  return {
    data: paginatedData,
    totalPages,
    currentPage: page,
    totalItems: data.length,
  };
};

/**
 * Sort array data
 * @param {Array} data - Data to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} - Sorted data
 */
export const sortData = (data, key, order = 'asc') => {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array data
 * @param {Array} data - Data to filter
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} - Filtered data
 */
export const filterData = (data, searchTerm, searchFields = []) => {
  if (!searchTerm) return data;

  const term = searchTerm.toLowerCase();
  return data.filter(item => {
    return searchFields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(term);
    });
  });
};

export default {
  formatApiError,
  buildQueryString,
  formatDateForApi,
  formatDateTimeForApi,
  parseApiDate,
  parseApiDateTime,
  uploadFile,
  debounce,
  validateFormData,
  paginateData,
  sortData,
  filterData,
};
