import axios from 'axios';
import { apiUrl } from './config';

// Tworzenie instancji axios z interceptorem
const api = axios.create({
  baseURL: `${apiUrl}/`, // URL twojego API
});

// Interceptor żądań - dodanie access token do każdego żądania
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor odpowiedzi - obsługa wygaśnięcia access token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${apiUrl}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;

          // Zapisanie nowego access token
          localStorage.setItem('accessToken', access);
          originalRequest.headers['Authorization'] = 'Bearer ' + access;

          // Ponowienie oryginalnego żądania
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Błąd podczas odświeżania tokenu:', refreshError);
          // Tutaj możesz wylogować użytkownika, jeśli odświeżenie tokenu się nie uda
        }
      }
    }

    return Promise.reject(error);
  }
);

// Funkcja do pobrania szczegółów użytkownika
export const getUserDetails = async () => {
  const response = await api.get(`${apiUrl}/auth/user/`); // Endpoint do UserDetailView
  return response.data;
};

export default api;
