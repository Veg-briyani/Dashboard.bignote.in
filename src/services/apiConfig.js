/**
 * Centralized API configuration for the author dashboard
 */

// Use environment variable with fallback
// Ensure proper URL format by handling potential format issues
export const API_BASE_URL = (() => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // Remove trailing slash if present
  const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  // Ensure 'api' is properly separated
  if (baseUrl.includes('apiauthor')) {
    return baseUrl.replace('apiauthor', 'api/author');
  }
  return baseUrl;
})();

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Common headers with auth token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

// Common fetch options with auth
export const getFetchOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    headers: getAuthHeaders()
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

export default {
  API_BASE_URL,
  getApiUrl,
  getAuthHeaders,
  getFetchOptions
};
