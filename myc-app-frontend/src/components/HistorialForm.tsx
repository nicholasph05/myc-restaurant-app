import React, { useState, useEffect } from 'react';

interface Cliente {
    id: number;
    nombre: string;
}

interface Plato {
    nombre: string;
}

interface PlatoConObs {
    nombre: string;
    observacion: string;
}

const HistorialForm: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [platosDisponibles, setPlatosDisponibles] = useState<Plato[]>([]);
    const [clienteId, setClienteId] = useState('');
    const [fecha, setFecha] = useState('');
    const [platoSeleccionado, setPlatoSeleccionado] = useState('');
    const [observacionInput, setObservacionInput] = useState('');
    const [platos, setPlatos] = useState<PlatoConObs[]>([]);
    const [mensaje, setMensaje] = useState('');
    const [clienteError, setClienteError] = useState('');
    const [fechaError, setFechaError] = useState('');
    const [platosError, setPlatosError] = useState('');


    // Cargar clientes y platos desde backend
    useEffect(() => {
        fetch('http://localhost:3000/api/clientes')
            .then(res => res.json())
            .then(data => setClientes(data));

        fetch('http://localhost:3000/api/platos')
            .then(res => res.json())
            .then(data => setPlatosDisponibles(data));
    }, []);

    const agregarPlato = () => {
        if (!platoSeleccionado.trim()) return;
        setPlatos([...platos, { nombre: platoSeleccionado, observacion: observacionInput.trim() }]);
        setPlatoSeleccionado('');
        setObservacionInput('');
    };

    const eliminarPlato = (index: number) => {
        const copia = [...platos];
        copia.splice(index, 1);
        setPlatos(copia);
    };

    const enviarHistorial = async () => {
        let errores = false;

        setClienteError('');
        setFechaError('');
        setPlatosError('');
        setMensaje('');

        if (!clienteId) {
            setClienteError('Selecciona un cliente');
            errores = true;
        }
        if (!fecha) {
            setFechaError('Selecciona una fecha');
            errores = true;
        }
        if (platos.length === 0) {
            setPlatosError('Debes agregar al menos un plato');
            errores = true;
        }

        if (errores) return;

        try {
            const res = await fetch('http://localhost:3000/api/historial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cliente_id: Number(clienteId),
                    fecha,
                    platos
                })
            });

            const data = await res.json();
            if (!res.ok) throw data;

            setMensaje('Historial guardado correctamente');
            setPlatos([]);
            setFecha('');
            setClienteId('');
        } catch (err: any) {
            setMensaje(err.error || 'Error al guardar historial');
        }
    };

    return (
        <div className="container mt-4">
            <h3>Registrar Historial de Pedido</h3>

            <div className="mb-3">
                <label>Cliente:</label>
                <select className="form-select" value={clienteId} onChange={e => setClienteId(e.target.value)}>
                    <option value="">Selecciona un cliente</option>
                    {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                {clienteError && <div className="text-danger mt-1">{clienteError}</div>}
            </div>

            <div className="mb-3">
                <label>Fecha:</label>
                <input type="datetime-local" className="form-control" value={fecha} onChange={e => setFecha(e.target.value)} />
                {fechaError && <div className="text-danger mt-1">{fechaError}</div>}
            </div>

            <div className="mb-3 d-flex gap-2">
                <select
                    className="form-select"
                    value={platoSeleccionado}
                    onChange={e => setPlatoSeleccionado(e.target.value)}
                >
                    <option value="">Selecciona un plato</option>
                    {platosDisponibles.map((p, i) => (
                        <option key={i} value={p.nombre}>{p.nombre}</option>
                    ))}
                </select>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Observación"
                    value={observacionInput}
                    onChange={e => setObservacionInput(e.target.value)}
                />
                <button className="btn btn-success" onClick={agregarPlato}>+</button>
            </div>

            <ul className="list-group mb-3">
                {platos.map((p, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                        <span><strong>{p.nombre}</strong>: {p.observacion || 'Sin observación'}</span>
                        <button className="btn btn-sm btn-danger" onClick={() => eliminarPlato(i)}>Eliminar</button>
                    </li>
                ))}
            </ul>
            {platosError && <div className="text-danger mb-3">{platosError}</div>}

            <button className="btn btn-primary" onClick={enviarHistorial}>Guardar Pedido</button>

            {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
        </div>
    );
};

export default HistorialForm;
