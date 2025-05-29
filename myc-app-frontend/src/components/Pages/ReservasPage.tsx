import React, { useState, useEffect } from 'react';

interface Cliente {
  id: number;
  nombre: string;
}

interface Reserva {
  id: number;
  cliente: string;
  mesa_id: number;
  fecha: string;
  hora: string;
  personas: number;
}

const ReservasPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);

  const [clienteId, setClienteId] = useState<number | ''>('');
  const [mesaId, setMesaId] = useState<number | ''>('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [personas, setPersonas] = useState(1);

  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [reservaEditandoId, setReservaEditandoId] = useState<number | null>(null);


  const [errores, setErrores] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    fetch('http://localhost:3000/api/clientes')
      .then((res) => res.json())
      .then((data: Cliente[]) => setClientes(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3000/api/reservas')
      .then((res) => res.json())
      .then((data: Reserva[]) => setReservas(data))
      .catch((err) => console.error(err));
  }, []);

  //GUARDAR RESERVAS//
  const guardarReserva = async (reservaData: {
    cliente_id: number;
    mesa_id: number;
    fecha: string;
    hora: string;
    personas: number;
  }) => {
    const res = await fetch('http://localhost:3000/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservaData),
    });

    const data = await res.json();

    if (!res.ok) {
      if (Array.isArray(data.errors)) {
        const erroresMap: { [key: string]: string[] } = {};
        data.errors.forEach((error: { field: string; message: string }) => {
          if (!erroresMap[error.field]) erroresMap[error.field] = [];
          erroresMap[error.field].push(error.message);
        });
        throw erroresMap;
      }
      throw new Error(data.error || 'Error al crear la reserva');
    }

    return data;
  };

  // CARGA LAS RESERVAS EN EL FORM PARA EDITAR//
  const cargarReservaParaEditar = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reservas/${id}`);
      const data: Reserva = await res.json();
      const cliente = clientes.find(c => c.nombre === data.cliente);
      setClienteId(cliente?.id || '');
      setMesaId(data.mesa_id);
      setFecha(data.fecha);
      setHora(data.hora);
      setPersonas(data.personas);
      setReservaEditandoId(data.id);
      setModoEdicion(true);
    } catch (err) {
      alert('Error al cargar la reserva para editar.');
    }
  };

  // LIMPIA EL FORM//
  const limpiarFormulario = () => {
    setClienteId('');
    setMesaId('');
    setFecha('');
    setHora('');
    setPersonas(1);
    setErrores({});
    setModoEdicion(false);
    setReservaEditandoId(null);
  };

  //ACTUALIZAR RESERVAS//
  const actualizarReserva = async (id: number, datos: {
    cliente_id: number;
    mesa_id: number;
    fecha: string;
    hora: string;
    personas: number;
  }) => {
    const res = await fetch(`http://localhost:3000/api/reservas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    const data = await res.json();

    if (!res.ok) {
      if (Array.isArray(data.errors)) {
        const erroresMap: { [key: string]: string[] } = {};
        data.errors.forEach((error: { field: string; message: string }) => {
          if (!erroresMap[error.field]) erroresMap[error.field] = [];
          erroresMap[error.field].push(error.message);
        });
        throw erroresMap; // <-- Esto lanza los errores en formato usable
      }
      throw new Error(data.error || 'Error al actualizar la reserva');
    }

    return data;
  };


  //ELIMINAR RESERVAS//
  const eliminarReserva = async (id: number) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar esta reserva?');
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3000/api/reservas/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('No se pudo eliminar la reserva');

      setReservas((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Error al eliminar la reserva.');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: { [key: string]: string[] } = {};

    if (clienteId === '') nuevosErrores.cliente_id = ['Debe seleccionar un cliente'];
    if (mesaId === '') nuevosErrores.mesa_id = ['Debe ingresar el ID de la mesa'];
    if (!fecha) nuevosErrores.fecha = ['Debe ingresar una fecha'];
    if (!hora) nuevosErrores.hora = ['Debe ingresar una hora'];
    if (!personas || personas < 1) nuevosErrores.personas = ['Debe ingresar al menos una persona'];

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    const horaConSegundos = hora.includes(':') && hora.split(':').length === 2
      ? `${hora}:00`
      : hora;

    try {
      const datosReserva = {
        cliente_id: clienteId as number,
        mesa_id: mesaId as number,
        fecha,
        hora: horaConSegundos,
        personas,
      };

      let reservaProcesada: Reserva;

      if (modoEdicion && reservaEditandoId !== null) {
        reservaProcesada = await actualizarReserva(reservaEditandoId, datosReserva);
        setReservas((prev) =>
          prev.map((r) => (r.id === reservaEditandoId ? reservaProcesada : r))
        );
      } else {
        reservaProcesada = await guardarReserva(datosReserva);
        setReservas((prev) => [...prev, reservaProcesada]);
      }

      limpiarFormulario();
    } catch (error: any) {
      console.log('Error capturado:', error);

      if (
        typeof error === 'object' &&
        !Array.isArray(error) &&
        error !== null
      ) {
        setErrores(error); // Muestra los errores en el formulario
      } else {
        alert(error.message || 'Error inesperado');
      }
    }
  };

  const reservasFiltradas = reservas.filter((r) => {
    return (
      (filtroFecha ? r.fecha === filtroFecha : true) &&
      (filtroCliente ? r.cliente.toLowerCase().includes(filtroCliente.toLowerCase()) : true)
    );
  });

  return (
    <div className="container my-5" style={{ maxWidth: '900px' }}>
      <h1 className="mb-4 text-center">Gestión de Reservas</h1>

      <form onSubmit={handleSubmit} className="mb-5 p-4 border rounded shadow-sm">
        <h2 className="h4 mb-3">Registrar nueva reserva</h2>

        <div className="mb-3">
          <label htmlFor="cliente_id" className="form-label">Cliente</label>
          <select
            id="cliente_id"
            className={`form-select ${errores.cliente_id ? 'is-invalid' : ''}`}
            value={clienteId}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setClienteId(isNaN(val) ? '' : val);
            }}
          >
            <option value="">-- Seleccione un cliente --</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {errores.cliente_id && errores.cliente_id.map((msg, i) => (
            <div key={i} className="invalid-feedback d-block">{msg}</div>
          ))}
        </div>

        <div className="mb-3">
          <label htmlFor="mesa_id" className="form-label">ID de la mesa</label>
          <input
            id="mesa_id"
            type="number"
            min={1}
            className={`form-control ${errores.mesa_id ? 'is-invalid' : ''}`}
            value={mesaId}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setMesaId(isNaN(val) ? '' : val);
            }}
          />
          {errores.mesa_id && errores.mesa_id.map((msg, i) => (
            <div key={i} className="invalid-feedback d-block">{msg}</div>
          ))}
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="fecha" className="form-label">Fecha</label>
            <input
              id="fecha"
              type="date"
              className={`form-control ${errores.fecha ? 'is-invalid' : ''}`}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            {errores.fecha && errores.fecha.map((msg, i) => (
              <div key={i} className="invalid-feedback d-block">{msg}</div>
            ))}
          </div>
          <div className="col-md-4">
            <label htmlFor="hora" className="form-label">Hora</label>
            <input
              id="hora"
              type="time"
              step="60"
              className={`form-control ${errores.hora ? 'is-invalid' : ''}`}
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
            {errores.hora && errores.hora.map((msg, i) => (
              <div key={i} className="invalid-feedback d-block">{msg}</div>
            ))}
          </div>
          <div className="col-md-4">
            <label htmlFor="personas" className="form-label">Número de personas</label>
            <input
              id="personas"
              type="number"
              min={1}
              className={`form-control ${errores.personas ? 'is-invalid' : ''}`}
              value={personas}
              onChange={(e) => setPersonas(parseInt(e.target.value) || 1)}
            />
            {errores.personas && errores.personas.map((msg, i) => (
              <div key={i} className="invalid-feedback d-block">{msg}</div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">Reservar</button>
      </form>

      {/* Filtros */}
      <section className="mb-4">
        <h2 className="h5 mb-3">Filtrar reservas</h2>
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="date"
              className="form-control"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Filtrar por cliente"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Lista de reservas */}
      <section>
        <h2 className="h5 mb-3">Lista de reservas</h2>
        {reservasFiltradas.length === 0 ? (
          <p className="text-muted fst-italic">No hay reservas que mostrar.</p>
        ) : (
          <table className="table table-striped table-hover text-center">
            <thead className="table-light">
              <tr>
                <th>Cliente</th>
                <th>Mesa</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Personas</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.map((r) => (
                <tr key={r.id}>
                  <td>{r.cliente}</td>
                  <td>{r.mesa_id}</td>
                  <td>{r.fecha}</td>
                  <td>{r.hora}</td>
                  <td>{r.personas}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => cargarReservaParaEditar(r.id)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarReserva(r.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </section>
    </div>
  );
};

export default ReservasPage;
