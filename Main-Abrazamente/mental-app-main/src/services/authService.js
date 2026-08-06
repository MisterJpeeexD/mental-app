import { apiRequest } from './apiClient';

export function loginRequest(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function currentUserRequest() {
  return apiRequest('/auth/me');
}
