// src/config/production.js

// Production Configuration
export const config = {
  API_BASE_URL:
    import.meta.env.MODE === 'development'
      ? '/api'
      : import.meta.env.VITE_API_URL,

  ENVIRONMENT: import.meta.env.MODE || 'production',

  ENABLE_LOGGING: import.meta.env.MODE === 'development',

  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

// API Configuration
export const API_CONFIG = {
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: config.ENVIRONMENT === 'production',
  ENABLE_DEBUG_MODE: config.ENVIRONMENT === 'development',
  ENABLE_PERFORMANCE_MONITORING: config.ENVIRONMENT === 'production',
};

// Debug Logs
console.log('🌍 Environment:', config.ENVIRONMENT);
console.log('🔗 API Base URL:', config.API_BASE_URL);