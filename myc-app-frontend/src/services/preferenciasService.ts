const API_URL = 'http://localhost:3000/api/preferencias'; // Ajusta la URL si es necesario

export interface Preferencias {
  cliente_id: number;
  intolerancias: string[];
  estilos_preferidos: string[];
  platos_favoritos: string[];
}

export const crearPreferencias = async (preferencias: Preferencias) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferencias),
  });
  if (!res.ok) throw await res.json();
  return await res.json();
};

export const obtenerPreferencias = async (cliente_id?: number) => {
  const url = cliente_id ? `${API_URL}?cliente_id=${cliente_id}` : API_URL;
  const res = await fetch(url);
  if (!res.ok) throw await res.json();
  return await res.json() as Preferencias[];
};
