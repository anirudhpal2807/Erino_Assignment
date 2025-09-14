// Production Configuration
export const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'https://erino-backend.onrender.com/api',
  ENVIRONMENT: process.env.REACT_APP_ENV || 'production',
  ENABLE_LOGGING: process.env.REACT_APP_ENV === 'development',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
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
