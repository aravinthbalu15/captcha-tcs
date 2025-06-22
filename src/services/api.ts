
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Authentication
  async login(email: string, password: string, captchaAnswer: string, captchaExpected: number) {
    const response = await api.post('/auth/login', {
      email,
      password,
      captchaAnswer,
      captchaExpected
    });
    return response.data;
  },

  async signup(name: string, email: string, password: string, captchaAnswer: string, captchaExpected: number) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      captchaAnswer,
      captchaExpected
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async getCaptcha() {
    const response = await api.get('/auth/captcha');
    return response.data;
  }
};
