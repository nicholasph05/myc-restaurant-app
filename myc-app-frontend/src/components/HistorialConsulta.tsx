import React, { useEffect, useState } from 'react';

interface Cliente {
  id: number;
  nombre: string;
}

interface Plato {
  nombre: string;
  observacion: string;
}

interface Pedido {
  fecha: string;
  platos: Plato[];
}

interface Historial {
  cliente_id: number;
  pedidos: Pedido[];
}

const HistorialConsulta: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteId, setClienteId] = useState('');
  const [historial, setHistorial] = useState<Historial | null>(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data));
  }, []);

  useEffect(() => {
    if (clienteId) {
      fetch(`http://localhost:3000/api/historial?cliente_id=${clienteId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setMensaje(data.error);
            setHistorial(null);
          } else {
            setHistorial(data);
            setMensaje('');
          }
        })
        .catch(() => {
          setMensaje('Error al obtener historial');
          setHistorial(null);
        });
    }
  }, [clienteId]);

  return (
    <div className="container mt-4">
      <h3>Historial de Pedidos del Cliente</h3>

      <div className="mb-3">
        <label>Cliente:</label>
        <select className="form-select" value={clienteId} onChange={e => setClienteId(e.target.value)}>
          <option value="">Selecciona un cliente</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {mensaje && <div className="alert alert-warning">{mensaje}</div>}

      {historial && (
        <div className="mt-4">
          {historial.pedidos.length === 0 ? (
            <p>No hay pedidos registrados.</p>
          ) : (
            historial.pedidos.map((pedido, index) => (
              <div key={index} className="card mb-3">
                <div className="card-header">
                  Pedido del {new Date(pedido.fecha).toLocaleString()}
                </div>
                <ul className="list-group list-group-flush">
                  {pedido.platos.map((plato, i) => (
                    <li key={i} className="list-group-item">
                      <strong>{plato.nombre}</strong>: {plato.observacion || 'Sin observación'}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HistorialConsulta;
