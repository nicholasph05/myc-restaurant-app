// services/pedidos.ts

import type { Pedido, PedidoFormData } from '../types/pedido';

const API_URL = 'http://localhost:3000/api/pedidos';

export const obtenerPedidos = async (filtros?: { cliente_id?: number; fecha?: string }) => {
  const params = new URLSearchParams();

  if (filtros?.cliente_id) params.append('cliente_id', filtros.cliente_id.toString());
  if (filtros?.fecha) params.append('fecha', filtros.fecha);

  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw await res.json();
  return await res.json() as Pedido[];
};

export const obtenerPedidoPorId = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw await res.json();
  return await res.json() as Pedido;
};

export const crearPedido = async (pedido: PedidoFormData) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data as Pedido;
};

export const actualizarPedido = async (id: number, pedido: PedidoFormData) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido),
  });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};

export const eliminarPedido = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE' },
  );
  if (!res.ok) throw await res.json();
}
