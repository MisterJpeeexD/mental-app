import { apiRequest } from './apiClient';

export function loginRequest(credentials) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function currentUserRequest() {
  return apiRequest('/api/auth/me');
}
