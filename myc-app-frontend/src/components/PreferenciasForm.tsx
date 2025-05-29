import React, { useEffect, useState } from 'react';
import { obtenerClientes } from '../services/clienteService';
import { obtenerPlatos, obtenerCategorias } from '../services/platoService';
import { crearPreferencias } from '../services/preferenciasService';

const estilosDisponibles = ['Vegetariano', 'Sin gluten', 'Vegano', 'Bajo en calorías'];
const intoleranciasDisponibles = ['Lácteos', 'Gluten', 'Frutos secos', 'Mariscos'];

const PreferenciasForm: React.FC = () => {
  const [clientes, setClientes] = useState<{ id: number; nombre: string }[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [platos, setPlatos] = useState<{ nombre: string; categoria: string }[]>([]);
  const [clienteId, setClienteId] = useState<number | ''>('');
  const [intolerancias, setIntolerancias] = useState<string[]>([]);
  const [estilos, setEstilos] = useState<string[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [platoSeleccionado, setPlatoSeleccionado] = useState('');
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [errores, setErrores] = useState<{ [campo: string]: string }>({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerClientes().then(setClientes);
    obtenerCategorias().then(setCategorias);
    obtenerPlatos().then(setPlatos);
  }, []);

  const handleCheckboxChange = (
    valor: string,
    estado: string[],
    setEstado: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (estado.includes(valor)) {
      setEstado(estado.filter(i => i !== valor));
    } else {
      setEstado([...estado, valor]);
    }
  };

  const agregarPlatoFavorito = () => {
    if (platoSeleccionado && !favoritos.includes(platoSeleccionado)) {
      setFavoritos([...favoritos, platoSeleccionado]);
    }
  };

  const eliminarPlatoFavorito = (nombre: string) => {
    setFavoritos(favoritos.filter(p => p !== nombre));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    const nuevosErrores: { [campo: string]: string } = {};

    if (!clienteId) nuevosErrores.cliente_id = 'Debes seleccionar un cliente.';
    if (favoritos.length === 0) nuevosErrores.platos_favoritos = 'Debes seleccionar al menos un plato favorito.';

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      await crearPreferencias({
        cliente_id: clienteId as number,
        intolerancias,
        estilos_preferidos: estilos,
        platos_favoritos: favoritos
      });
      setMensaje('Preferencias guardadas con éxito.');
    } catch (error: any) {
      setMensaje(error?.message || 'Error al guardar las preferencias.');
    }
  };

  const platosFiltrados = categoriaSeleccionada
    ? platos.filter(p => p.categoria === categoriaSeleccionada)
    : platos;

  return (
    <div className="card p-4 shadow-sm">
      <h4>Preferencias del Cliente</h4>
      <form onSubmit={handleSubmit}>
        {/* Cliente */}
        <div className="mb-3">
          <label className="form-label">Cliente</label>
          <select
            className="form-select"
            value={clienteId}
            onChange={e => setClienteId(Number(e.target.value))}
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          {errores.cliente_id && <div className="text-danger">{errores.cliente_id}</div>}
        </div>

        {/* Intolerancias */}
        <div className="mb-3">
          <label className="form-label">Intolerancias</label><br />
          {intoleranciasDisponibles.map(opcion => (
            <div className="form-check form-check-inline" key={opcion}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={intolerancias.includes(opcion)}
                onChange={() => handleCheckboxChange(opcion, intolerancias, setIntolerancias)}
              />
              <label className="form-check-label">{opcion}</label>
            </div>
          ))}
        </div>

        {/* Estilos preferidos */}
        <div className="mb-3">
          <label className="form-label">Estilos Preferidos</label><br />
          {estilosDisponibles.map(opcion => (
            <div className="form-check form-check-inline" key={opcion}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={estilos.includes(opcion)}
                onChange={() => handleCheckboxChange(opcion, estilos, setEstilos)}
              />
              <label className="form-check-label">{opcion}</label>
            </div>
          ))}
        </div>

        {/* Selección de platos por categoría */}
        <div className="mb-3">
          <label className="form-label">Categoría de Platos</label>
          <select
            className="form-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Plato</label>
          <select
            className="form-select"
            value={platoSeleccionado}
            onChange={e => setPlatoSeleccionado(e.target.value)}
          >
            <option value="">Seleccione un plato</option>
            {platosFiltrados.map(p => (
              <option key={p.nombre} value={p.nombre}>{p.nombre}</option>
            ))}
          </select>
          <button type="button" className="btn btn-secondary mt-2" onClick={agregarPlatoFavorito}>
            Añadir a favoritos
          </button>
        </div>

        {/* Lista de favoritos */}
        <div className="mb-3">
          <label className="form-label">Platos Favoritos</label>
          <ul className="list-group">
            {favoritos.map(p => (
              <li key={p} className="list-group-item d-flex justify-content-between align-items-center">
                {p}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => eliminarPlatoFavorito(p)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          {errores.platos_favoritos && <div className="text-danger mt-2">{errores.platos_favoritos}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Guardar</button>
        {mensaje && <div className="mt-3 alert alert-info">{mensaje}</div>}
      </form>
    </div>
  );
};

export default PreferenciasForm;
