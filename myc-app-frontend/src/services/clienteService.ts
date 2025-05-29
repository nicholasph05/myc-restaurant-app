import type { Cliente } from '../types/cliente';

const API_URL = 'http://localhost:3000/api/clientes';

// Obtener todos los clientes
export async function obtenerClientes(): Promise<Cliente[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  return response.json();
}

// Crear cliente
export async function crearCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;  // Lanzar el objeto con errores
  }

  return response.json();
}

// Editar cliente
export async function editarCliente(cliente: Cliente): Promise<Cliente> {
  const response = await fetch(`${API_URL}/${cliente.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
}

// Eliminar cliente
export async function eliminarCliente(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
}
