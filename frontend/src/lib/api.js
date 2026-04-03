export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!response.ok) {
    const errorMessage =
      data?.detail ||
      data?.error ||
      (typeof data?.raw === 'string' && data.raw.includes('<!DOCTYPE')
        ? `API returned HTML instead of JSON (${response.status}). Make sure the backend server on ${API_BASE_URL} is running and the route exists.`
        : 'Request failed');

    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  return data;
}
