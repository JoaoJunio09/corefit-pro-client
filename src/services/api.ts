import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
	timeout: 30000
});

api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth/')) {
    window.dispatchEvent(new Event('corefit:session-expired'));
  }
  return Promise.reject(error);
});

export default api;
