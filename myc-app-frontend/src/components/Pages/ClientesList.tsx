import React, { useState, useEffect } from 'react';
import type { Cliente } from '../../types/cliente';
import ClienteForm from '../ClienteForm';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
  crearCliente,
  editarCliente,
  obtenerClientes,
  eliminarCliente,
} from '../../services/clienteService';

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await obtenerClientes();
      setClientes(data);
    } catch {
      toast.error('Error cargando clientes');
    }
  };

  const handleAgregar = () => {
    setEditingCliente(null);
    setFormErrors({});
    setShowForm(true);
  };

  const handleEditar = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormErrors({});
    setShowForm(true);
  };

  const handleEliminar = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await eliminarCliente(id);
        toast.success('Cliente eliminado exitosamente');
        cargarClientes();
      } catch (error: any) {
        toast.error(error.message || 'Error al eliminar cliente');
      }
    }
  };

  const handleCancelar = () => {
    setShowForm(false);
  };

  const handleGuardar = async (clienteData: Omit<Cliente, 'id'>) => {
    try {
      setFormErrors({});
      if (editingCliente) {
        await editarCliente({ ...editingCliente, ...clienteData });
      } else {
        await crearCliente(clienteData);
      }
      setShowForm(false);
      cargarClientes();
    } catch (error: any) {
      if (error.errors) {
        setFormErrors(error.errors);
      } else {
        toast.error(error.message || 'Error inesperado');
      }
    }
  };

  return (
    <div className="w-100 px-3" style={{ 
      minHeight: '100vh',
      backgroundColor: '#fff',
      padding: '2rem 0'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header className="text-center mb-5">
          <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: '0.05em' }}>
            MyC App
          </h1>
          <h2 className="display-5 fw-semibold mb-4 text-secondary">Gestión de Clientes</h2>
          {!showForm && (
            <button
              className="btn btn-success btn-lg px-4 shadow-lg"
              onClick={handleAgregar}
              style={{ borderRadius: '0.5rem' }}
            >
              Nuevo Cliente
            </button>
          )}
        </header>

        {showForm && (
          <section 
            className="card shadow-lg p-4 mb-5 rounded-4 border-0"
            style={{
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            <ClienteForm
              cliente={editingCliente ?? undefined}
              onSubmit={handleGuardar}
              onCancel={handleCancelar}
              errors={formErrors}
            />
          </section>
        )}

        {!showForm && (
          <section className="card shadow rounded-4 border-0">
            <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table
                className="table table-striped table-hover mb-0 text-center align-middle"
              >
                <thead
                  className="table-light"
                  style={{ position: 'sticky', top: 0, zIndex: 1 }}
                >
                  <tr>
                    <th className="py-3 fs-6 text-uppercase text-primary">Nombre</th>
                    <th className="py-3 fs-6 text-uppercase text-primary">Correo</th>
                    <th className="py-3 fs-6 text-uppercase text-primary">Teléfono</th>
                    <th className="py-3 fs-6 text-uppercase text-primary">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length > 0 ? (
                    clientes.map((c) => (
                      <tr key={c.id} className="align-middle">
                        <td className="py-3">{c.nombre}</td>
                        <td className="py-3">{c.correo}</td>
                        <td className="py-3">{c.telefono}</td>
                        <td className="py-3">
                          <div className="d-flex justify-content-center gap-3">
                            <button
                              className="btn btn-outline-primary btn-sm px-3 shadow-sm"
                              onClick={() => handleEditar(c)}
                              style={{ borderRadius: '0.4rem' }}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm px-3 shadow-sm"
                              onClick={() => handleEliminar(c.id)}
                              style={{ borderRadius: '0.4rem' }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-5 text-muted fst-italic">
                        No hay clientes registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ClientesPage;
