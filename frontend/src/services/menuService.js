const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro inesperado.' }));
    throw new Error(errorData.message || 'Erro inesperado.');
  }

  return response.json();
}

export function fetchCategories() {
  return request('/categories');
}

export function fetchMenuItems(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return request(`/menu-items${query}`);
}

export function createMenuItem(payload) {
  return request('/menu-items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
