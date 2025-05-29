// types/pedido.ts

import type{ Cliente } from './cliente';
import type { Plato } from './plato';

export interface DetallePedido {
  id?: number;
  pedido_id?: number;
  plato_id: number;
  cantidad: number;
  plato?: Plato; // Incluido solo en respuesta desde el backend
}

export interface Pedido {
  id: number;
  cliente_id: number;
  fecha: string;
  total: number;
  cliente?: Cliente; // Incluido solo en respuesta desde el backend
  detalles?: DetallePedido[];
}

// Este tipo es útil para formularios de creación (sin ID)
export type PedidoFormData = {
  cliente_id: number;
  fecha?: string;
  detalles: {
    plato_id: number;
    cantidad: number;
  }[];
};
