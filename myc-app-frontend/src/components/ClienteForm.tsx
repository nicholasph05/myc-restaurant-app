import React, { useState, useEffect } from 'react';
import type { Cliente } from '../types/cliente';

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (clienteData: Omit<Cliente, 'id'>) => void;
  onCancel: () => void;
  errors?: Record<string, string>;
}

const ClienteForm: React.FC<ClienteFormProps> = ({
  cliente,
  onSubmit,
  onCancel,
  errors = {},
}) => {
  const [nombre, setNombre] = useState(cliente?.nombre || '');
  const [correo, setCorreo] = useState(cliente?.correo || '');
  const [telefono, setTelefono] = useState(cliente?.telefono || '');

  // Sincronizar estado cuando cambia el cliente
  useEffect(() => {
    setNombre(cliente?.nombre || '');
    setCorreo(cliente?.correo || '');
    setTelefono(cliente?.telefono || '');
  }, [cliente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nombre, correo, telefono });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-light">
      <div className="mb-3">
        <label className="form-label">Nombre:</label>
        <input
          className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Ingrese el nombre"
        />
        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Correo:</label>
        <input
          className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          placeholder="correo@ejemplo.com"
        />
        {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Teléfono:</label>
        <input
          className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          placeholder="+57 300 1234567"
        />
        {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
      </div>

      <div>
        <button type="submit" className="btn btn-primary me-2">
          {cliente ? 'Editar' : 'Crear'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ClienteForm;
