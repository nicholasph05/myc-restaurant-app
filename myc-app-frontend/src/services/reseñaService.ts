import type { Reseña } from '../types/reseña';

const API_URL = 'http://localhost:3000/api/resenas'; // Ajusta si es necesario

export const crearReseña = async (reseña: Reseña) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reseña),
    });
    if (!res.ok) throw await res.json();
    return await res.json();
};

export const obtenerReseñas = async (filtros?: {
    tipo_visita?: string;
    calificacion?: number;
    plato?: string;
}) => {
    const params = new URLSearchParams();
    if (filtros?.tipo_visita) params.append('tipo_visita', filtros.tipo_visita);
    if (filtros?.calificacion) params.append('calificacion', filtros.calificacion.toString());
    if (filtros?.plato) params.append('plato', filtros.plato);

    const res = await fetch(`${API_URL}?${params.toString()}`);
    if (!res.ok) throw await res.json();
    return await res.json() as Reseña[];
};

export const eliminarReseña = async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw await res.json();
    return await res.json();
};

export const obtenerPlatos = async () => {
  const res = await fetch('http://localhost:3001/platos');
  if (!res.ok) throw await res.json();
  return await res.json();
};
