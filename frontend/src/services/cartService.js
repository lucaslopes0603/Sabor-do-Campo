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

  const text = await response.text();

  if (!text) return null;

  return JSON.parse(text);
}

export function fetchCartItems(cartId) {
  return request(`/carts/${cartId}/items`);
}

export function createCartItem(cartId, menuItemId) {
  return request(`/carts/${cartId}/items`, {
    method: 'POST',
    body: JSON.stringify({ menuItemId }),
  });
}

export function removeCartItem(cartId, itemId) {
  return request(`/carts/${cartId}/items/${itemId}`, {
    method: 'DELETE',
  });
}
