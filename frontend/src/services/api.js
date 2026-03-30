import axios from 'axios';

const API_BASE_URL = '/api/v1';

// Lazy import to break circular dependency (store → slice → service → api → store)
let _store;
export const injectStore = (s) => {
  _store = s;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach access token
api.interceptors.request.use(
  (config) => {
    const token = _store?.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );

        const newToken = data.data.accessToken;

        // Update token in Redux store
        _store?.dispatch({ type: 'auth/tokenRefreshed', payload: newToken });

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        _store?.dispatch({ type: 'auth/logout' });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
