import { clearToken, getToken } from './tokenStore';

const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('No fue posible conectar con el servidor. Revisa que el backend esté iniciado.');
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '');

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearToken();
      window.dispatchEvent(new Event('abrazamente:unauthorized'));
    }
    const message = payload?.mensaje || payload?.message || 'La solicitud no pudo completarse';
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}
