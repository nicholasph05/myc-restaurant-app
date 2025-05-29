import React, { useEffect, useState } from 'react';
import type { Plato } from '../../types/plato';
import {
  obtenerPlatos,
  crearPlato,
  editarPlato,
  eliminarPlato,
  obtenerCategoriasUnicas,
} from '../../services/platoService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import PlatoForm from '../PlatoForm';

const PlatosPage: React.FC = () => {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([]);
  const [filtros, setFiltros] = useState({
    nombre: '',
    categoria: '',
    disponibilidad: '',
  });

  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar' | null>(null);
  const [platoEditando, setPlatoEditando] = useState<Plato | null>(null);

  useEffect(() => {
    cargarPlatos();
  }, [filtros]);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategoriasUnicas();
        setCategoriasDisponibles(data);
      } catch {
        toast.error('Error cargando categorías');
      }
    };
    cargarCategorias();
  }, []);

  const cargarPlatos = async () => {
    try {
      const data = await obtenerPlatos({
        nombre: filtros.nombre,
        categoria: filtros.categoria,
        disponibilidad:
          filtros.disponibilidad === '' ? undefined : filtros.disponibilidad === 'true',
      });
      setPlatos(data);
    } catch {
      toast.error('Error cargando platos');
    }
  };

  const handleGuardar = async (platoData: Omit<Plato, 'id'>) => {
    try {
      if (modoFormulario === 'crear') {
        await crearPlato(platoData);
        toast.success('Plato creado');
      } else if (modoFormulario === 'editar' && platoEditando) {
        await editarPlato({ ...platoEditando, ...platoData });
        toast.success('Plato actualizado');
      }
      resetFormulario();
      cargarPlatos();
    } catch (err: any) {
      if (err.errors) {
        throw err.errors;
      } else {
        toast.error(err.message || 'Error');
      }
    }
  };

  const resetFormulario = () => {
    setModoFormulario(null);
    setPlatoEditando(null);
  };

  const handleEditar = (plato: Plato) => {
    setModoFormulario('editar');
    setPlatoEditando(plato);
  };

  const handleEliminar = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar plato?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        await eliminarPlato(id);
        toast.success('Plato eliminado');
        cargarPlatos();
      } catch {
        toast.error('Error al eliminar el plato');
      }
    }
  };

  const cambiarEstado = async (plato: Plato) => {
    try {
      await editarPlato({ ...plato, disponibilidad: !plato.disponibilidad });
      toast.success('Estado actualizado');
      cargarPlatos();
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Gestión de Menú y Platos</h1>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre"
            value={filtros.nombre}
            onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filtros.categoria}
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
          >
            <option value="">Todas las categorías</option>
            {categoriasDisponibles.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filtros.disponibilidad}
            onChange={(e) => setFiltros({ ...filtros, disponibilidad: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="true">Disponibles</option>
            <option value="false">No disponibles</option>
          </select>
        </div>
      </div>

      {modoFormulario && (
        <PlatoForm
          plato={modoFormulario === 'editar' ? platoEditando ?? undefined : undefined}
          onSubmit={handleGuardar}
          onCancel={resetFormulario}
        />
      )}

      {!modoFormulario && (
        <div className="text-end mb-3">
          <button
            className="btn btn-success"
            onClick={() => setModoFormulario('crear')}
          >
            Nuevo Plato
          </button>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover text-center">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {platos.length > 0 ? (
              platos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${parseFloat(p.precio.toString()).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.disponibilidad ? 'bg-success' : 'bg-secondary'}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => cambiarEstado(p)}
                    >
                      {p.disponibilidad ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(p)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(p.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-muted py-4">No hay platos que mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlatosPage;