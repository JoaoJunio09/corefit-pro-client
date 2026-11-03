import axios from "axios";

const configuredApiUrl = import.meta.env.DEV
	? import.meta.env.VITE_API_URL_DEV
	: import.meta.env.VITE_API_URL_PROD;
const apiUrl = configuredApiUrl
	? (/^https?:\/\//i.test(configuredApiUrl) ? configuredApiUrl : `https://${configuredApiUrl}`)
	: import.meta.env.DEV
		? "http://localhost:8080"
		: "https://corefit-pro-production.up.railway.app";

const api = axios.create({
	baseURL: apiUrl.replace(/\/$/, ""),
	timeout: 30000
});

api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth/')) {
    window.dispatchEvent(new Event('corefit:session-expired'));
  }
  return Promise.reject(error);
});

export default api;
