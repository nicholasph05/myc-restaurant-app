import type { Plato } from '../types/plato';

const API_URL = 'http://localhost:3000/api/platos';



export const obtenerPlatos = async (filtros?: Partial<Plato>): Promise<Plato[]> => {
  const params = new URLSearchParams();

  if (filtros?.nombre) params.append('nombre', filtros.nombre);
  if (filtros?.categoria) params.append('categoria', filtros.categoria);
  if (filtros?.disponibilidad !== undefined) {
    params.append('disponibilidad', filtros.disponibilidad.toString());
  }

  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw await res.json();
  return await res.json() as Plato[];
};

export const crearPlato = async (plato: Omit<Plato, 'id'>) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plato),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const editarPlato = async (plato: Plato) => {
  const res = await fetch(`${API_URL}/${plato.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plato),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const eliminarPlato = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw await res.json();
};

export const obtenerCategoriasUnicas = async (): Promise<string[]> => {
  const res = await fetch(`${API_URL}/categorias/unicas`);
  if (!res.ok) throw new Error('Error al obtener categorías');
  return await res.json();
};

export const obtenerCategorias = async (): Promise<string[]> => {
  const res = await fetch(`${API_URL}/categorias/unicas`);
  if (!res.ok) throw await res.json();
  return await res.json();
};




