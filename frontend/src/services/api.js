import axios from 'axios';
import { API_CONFIG, FEATURES } from '../config/production';

const api = axios.create(API_CONFIG);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (FEATURES.ENABLE_DEBUG_MODE) {
      console.log('API Request:', config.method?.toUpperCase(), config.url, config.params);
    }
    return config;
  },
  (error) => {
    if (FEATURES.ENABLE_DEBUG_MODE) {
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (FEATURES.ENABLE_DEBUG_MODE) {
      console.log('✅ API Response Success:', response.status, response.config.url);
      console.log('📊 API Response Data:', response.data);
    }
    return response;
  },
  (error) => {
    if (FEATURES.ENABLE_DEBUG_MODE) {
      console.error('❌ API Response Error:', error.message);
      console.error('🔍 Error Details:', {
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
        code: error.code
      });
    }
    
    // For 401, let the caller/auth context decide how to handle navigation.
    // Avoid hard reloads that cause flicker loops on the login page.
    // if (error.response?.status === 401) { /* handle in AuthContext */ }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Leads API
export const leadsAPI = {
  getLeads: (params) => api.get('/leads', { params }),
  getLead: (id) => api.get(`/leads/${id}`),
  createLead: (data) => api.post('/leads', data),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  getLeadStats: () => api.get('/leads/stats'),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
};

export default api;
