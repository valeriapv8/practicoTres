const API = 'http://localhost:3000'; // mismo origen que backend

export const addParticipanteByLink = async (link, payload) => {
  const res = await fetch(`${API}/participantes/${link}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const loginParticipante = async (link, payload) => {
  const res = await fetch(`${API}/participantes/${link}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

export const getParticipanteByToken = async (token) => {
  const res = await fetch(`${API}/participantes/${token}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return res.json();
};

export const addWishlistItem = async (token, wishlist) => {
  const res = await fetch(`${API}/participantes/${token}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wishlist })
  });
  return res.json();
};

export const updateParticipante = async (token, payload) => {
  const res = await fetch(`${API}/participantes/${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
};

// Compatibilidad: alias para nombres que componentes esperan
// (no elimina las exportaciones actuales, sólo crea nombres adicionales)
export { addParticipanteByLink as createParticipante };