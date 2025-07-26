// API Configuration
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or default
    return (window as any).__NEXT_PUBLIC_API_URL__ || 'http://localhost:5000';
  }
  // Server-side: use environment variable or default
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiBaseUrl();

// API Endpoints
export const API_ENDPOINTS = {
  VENUES: `${API_BASE_URL}/api/venues`,
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
  AUTH: `${API_BASE_URL}/api/auth`,
  VENDOR: `${API_BASE_URL}/api/vendor`,
  ADMIN: `${API_BASE_URL}/api/admin`,
} as const;

// Helper function to get API URL
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`; 