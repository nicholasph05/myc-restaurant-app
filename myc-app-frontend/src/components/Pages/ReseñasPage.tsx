import React, { useEffect, useState } from 'react';
import { obtenerReseñas, eliminarReseña } from '../../services/reseñaService';

interface Reseña {
  _id?: string; // permitido undefined por seguridad
  cliente_id: number;
  fecha: string;
  tipo_visita: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Evento' | 'Otro';
  platos_consumidos: { id: number | null; nombre: string }[];
  comentario: string;
  calificacion: number;
}

const ResenasList: React.FC = () => {
  const [reseñas, setReseñas] = useState<Reseña[]>([]);
  const [tipoVisita, setTipoVisita] = useState('');
  const [calificacion, setCalificacion] = useState<number | ''>('');
  const [plato, setPlato] = useState('');

  const cargarReseñas = async () => {
    try {
      const filtros = {
        tipo_visita: tipoVisita || undefined,
        calificacion: calificacion || undefined,
        plato: plato || undefined,
      };
      const data = await obtenerReseñas(filtros);
      setReseñas(data);
    } catch (err) {
      console.error('Error al cargar reseñas', err);
      alert('Error al cargar reseñas');
    }
  };

  useEffect(() => {
    cargarReseñas();
  }, []);

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta reseña?')) {
      try {
        await eliminarReseña(id);
        cargarReseñas();
      } catch (err) {
        alert('Error al eliminar reseña');
      }
    }
  };

  return (
    <div>
      <h2>Reseñas</h2>

      <div className="card p-3 mb-3 shadow-sm">
        <h5>Filtros</h5>
        <div className="row">
          <div className="col-md-3">
            <label className="form-label">Tipo de Visita</label>
            <select className="form-select" value={tipoVisita} onChange={e => setTipoVisita(e.target.value)}>
              <option value="">Todos</option>
              <option value="Desayuno">Desayuno</option>
              <option value="Almuerzo">Almuerzo</option>
              <option value="Cena">Cena</option>
              <option value="Evento">Evento</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Calificación</label>
            <select className="form-select" value={calificacion} onChange={e => setCalificacion(Number(e.target.value) || '')}>
              <option value="">Todas</option>
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} estrella{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Buscar por Plato</label>
            <input className="form-control" value={plato} onChange={e => setPlato(e.target.value)} placeholder="Ej: Lomo, Pizza..." />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={cargarReseñas}>Filtrar</button>
          </div>
        </div>
      </div>

      {reseñas.length === 0 ? (
        <p>No hay reseñas registradas.</p>
      ) : (
        <ul className="list-group">
          {reseñas.map(r => (
            <li key={r._id || `${r.cliente_id}-${r.fecha}`} className="list-group-item">
              <strong>Cliente ID:</strong> {r.cliente_id} | 
              <strong> Fecha:</strong> {r.fecha.slice(0, 10)} | 
              <strong> Tipo:</strong> {r.tipo_visita} | 
              <strong> Calificación:</strong> {r.calificacion} ★ <br />
              <strong>Comentario:</strong> {r.comentario}<br />
              <strong>Platos:</strong> {r.platos_consumidos.map(p => p.nombre).join(', ')}
              {r._id && (
                <button
                  className="btn btn-danger btn-sm float-end"
                  onClick={() => handleEliminar(r._id!)}
                >
                  Eliminar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResenasList;
