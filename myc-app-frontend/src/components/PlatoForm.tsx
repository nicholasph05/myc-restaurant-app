import React, { useState, useEffect } from 'react';
import type { Plato } from '../types/plato';

interface PlatoFormProps {
  plato?: Plato;
  onSubmit: (platoData: Omit<Plato, 'id'>) => void;
  onCancel: () => void;
}

type PlatoFormState = {
  nombre: string;
  categoria: string;
  precio: string;
  disponibilidad: boolean;
};


const PlatoForm: React.FC<PlatoFormProps> = ({ plato, onSubmit, onCancel }) => {
const [form, setForm] = useState<PlatoFormState>({
  nombre: '',
  categoria: '',
  precio: '',
  disponibilidad: true,
});

  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (plato) {
      setForm({
        nombre: plato.nombre,
        categoria: plato.categoria,
        precio: plato.precio.toString(),
        disponibilidad: plato.disponibilidad,
      });
    }
  }, [plato]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrores({});

    const nuevosErrores: Record<string, string> = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio';
    if (!form.precio || parseFloat(form.precio) <= 0) nuevosErrores.precio = 'El precio debe ser mayor que 0';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      await onSubmit({
        ...form,
        precio: parseFloat(form.precio),
      });
    } catch (err: any) {
      setErrores(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
      <h4 className="mb-3">{plato ? 'Editar Plato' : 'Nuevo Plato'}</h4>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
        {errores.nombre && <div className="invalid-feedback d-block">{errores.nombre}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <input
          className={`form-control ${errores.categoria ? 'is-invalid' : ''}`}
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
        />
        {errores.categoria && <div className="invalid-feedback d-block">{errores.categoria}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Precio</label>
        <input
          type="text"
          className={`form-control ${errores.precio ? 'is-invalid' : ''}`}
          value={form.precio}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*\.?\d{0,2}$/.test(val) || val === '') {
              setForm({ ...form, precio: val });
            }
          }}
          placeholder="Ej: 15000.00"
        />
        {errores.precio && <div className="invalid-feedback d-block">{errores.precio}</div>}
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="disponibleCheck"
          checked={form.disponibilidad}
          onChange={(e) => setForm({ ...form, disponibilidad: e.target.checked })}
        />
        <label className="form-check-label" htmlFor="disponibleCheck">
          Disponible
        </label>
      </div>

      <button type="submit" className="btn btn-primary me-2">
        Guardar
      </button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
};

export default PlatoForm;
