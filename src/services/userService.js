import { apiRequest } from './apiClient';

export function registerUserRequest(userData) {
  return apiRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}
