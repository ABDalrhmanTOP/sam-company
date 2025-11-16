import axios from 'axios';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('admin_token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  delete axios.defaults.headers.common['Authorization'];
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

export const requireAuth = (): void => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  }
};
