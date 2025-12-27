// FrontEnd/src/utils/api.js

const API_BASE_URL = '/api';

const getAuthToken = () => localStorage.getItem('authToken');

const safeJson = async (res) => {
  if (res.status === 204 || res.status === 304) return null;
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  return await res.json();
};

export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    'Content-Type': options.body ? 'application/json' : undefined,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: headers,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    // Handle unauthorized/invalid token globally
    if (res.status === 401 || res.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // Simple client-side redirect for full re-login experience
        // window.location.assign('/'); 
      }
    }
    throw new Error(data?.message || `API Error: ${res.status}`);
  }

  return data;
};

export const publicFetch = async (endpoint, options = {}) => {
  const headers = {
    ...options.headers,
    'Content-Type': options.body ? 'application/json' : undefined,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: headers,
  });

  const data = await safeJson(res);

  if (!res.ok) {
    throw new Error(data?.message || `API Error: ${res.status}`);
  }

  return data;
};