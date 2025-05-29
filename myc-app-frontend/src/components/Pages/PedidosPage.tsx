import React, { useEffect, useState } from 'react';
import { obtenerClientes } from '../../services/clienteService';
import { obtenerPlatos, obtenerCategorias } from '../../services/platoService';
import { crearPedido, obtenerPedidos, eliminarPedido } from '../../services/pedidoService';

interface Cliente {
    id: number;
    nombre: string;
}

interface Plato {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
}

interface DetallePedido {
    plato_id: number;
    cantidad: number;
}

const PedidosPage: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [clienteId, setClienteId] = useState<number>(0);
    const [detalles, setDetalles] = useState<DetallePedido[]>([]);
    const [fecha, setFecha] = useState('');
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [filtroClienteId, setFiltroClienteId] = useState('');
    const [filtroFecha, setFiltroFecha] = useState('');
    const [errores, setErrores] = useState<Record<string, string>>({});
    const [categorias, setCategorias] = useState<string[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

    useEffect(() => {
        obtenerClientes().then(setClientes);
        obtenerPlatos().then(setPlatos);
        obtenerCategorias().then(setCategorias);
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        const params: any = {};
        if (filtroClienteId) params.cliente_id = filtroClienteId;
        if (filtroFecha) params.fecha = filtroFecha;

        const res = await obtenerPedidos(params);
        setPedidos(res);
    };

    const eliminarDetalle = (index: number) => {
        const nuevosDetalles = detalles.filter((_, i) => i !== index);
        setDetalles(nuevosDetalles);
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { plato_id: 0, cantidad: 1 }]);
    };

    const actualizarDetalle = (index: number, campo: string, valor: any) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index] = { ...nuevosDetalles[index], [campo]: valor };
        setDetalles(nuevosDetalles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const nuevosErrores: Record<string, string> = {};

        if (!clienteId) nuevosErrores.cliente_id = 'Debe seleccionar un cliente.';
        if (!fecha) nuevosErrores.fecha = 'Debe seleccionar una fecha.';
        if (detalles.length === 0) nuevosErrores.detalles = 'Debe agregar al menos un plato.';

        detalles.forEach((detalle, index) => {
            if (!detalle.plato_id) nuevosErrores[`plato_id_${index}`] = 'Plato inválido.';
            if (!detalle.cantidad || detalle.cantidad <= 0)
                nuevosErrores[`cantidad_${index}`] = 'Cantidad debe ser mayor a 0.';
        });

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        try {
            console.log('Enviando pedido:', { cliente_id: clienteId, fecha, detalles });
            await crearPedido({ cliente_id: clienteId, fecha, detalles });
            setClienteId(0);
            setFecha('');
            setDetalles([]);
            setErrores({});
            cargarPedidos();
        } catch (error: any) {
            alert(error.message || 'Error al registrar pedido');
        }
    };

    const platosFiltrados = categoriaSeleccionada
        ? platos.filter(p => p.categoria === categoriaSeleccionada)
        : platos;

    const totalEstimado = detalles.reduce((acc, d) => {
        const plato = platos.find(p => p.id === d.plato_id);
        return acc + (plato ? plato.precio * d.cantidad : 0);
    }, 0);

    return (
        <div>
            <h2>Registrar Pedido</h2>
            <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Cliente</label>
                    <select
                        className={`form-select ${errores.cliente_id ? 'is-invalid' : ''}`}
                        value={clienteId}
                        onChange={(e) => setClienteId(Number(e.target.value))}
                    >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                    {errores.cliente_id && <div className="invalid-feedback d-block">{errores.cliente_id}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Fecha</label>
                    <input
                        type="date"
                        className={`form-control ${errores.fecha ? 'is-invalid' : ''}`}
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                    {errores.fecha && <div className="invalid-feedback d-block">{errores.fecha}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Filtrar por Categoría</label>
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

                <div>
                    <label className="form-label">Platos</label>
                    {detalles.map((detalle, i) => {
                        const platoActual = platos.find(p => p.id === detalle.plato_id);
                        const opcionesPlato = [
                            ...platosFiltrados,
                            ...(platoActual && !platosFiltrados.some(p => p.id === platoActual.id) ? [platoActual] : [])
                        ];

                        return (
                            <div className="d-flex align-items-center mb-2" key={i}>
                                <select
                                    className={`form-select me-2 ${errores[`plato_id_${i}`] ? 'is-invalid' : ''}`}
                                    value={detalle.plato_id}
                                    onChange={(e) => actualizarDetalle(i, 'plato_id', Number(e.target.value))}
                                >
                                    <option value="">Seleccione un plato</option>
                                    {opcionesPlato.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre}</option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    className={`form-control me-2 ${errores[`cantidad_${i}`] ? 'is-invalid' : ''}`}
                                    min={1}
                                    value={detalle.cantidad}
                                    onChange={(e) => actualizarDetalle(i, 'cantidad', Number(e.target.value))}
                                />

                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => eliminarDetalle(i)}
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}

                    {errores.detalles && <div className="text-danger">{errores.detalles}</div>}
                    {detalles.map((_, i) => (
                        <div key={`error-${i}`}>
                            {errores[`plato_id_${i}`] && <div className="text-danger">{errores[`plato_id_${i}`]}</div>}
                            {errores[`cantidad_${i}`] && <div className="text-danger">{errores[`cantidad_${i}`]}</div>}
                        </div>
                    ))}

                    <button type="button" className="btn btn-secondary" onClick={agregarDetalle}>Agregar Plato</button>
                </div>


                <p className="mt-3"><strong>Total estimado:</strong> ${totalEstimado}</p>

                <button type="submit" className="btn btn-primary mt-3">Registrar Pedido</button>
            </form>

            <h3>Pedidos Registrados</h3>
            <h4>Buscar Pedidos</h4>
            <div className="row mb-4">
                <div className="col-md-4">
                    <label className="form-label">Cliente</label>
                    <select
                        className="form-select"
                        value={filtroClienteId}
                        onChange={(e) => setFiltroClienteId(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label">Fecha</label>
                    <input
                        type="date"
                        className="form-control"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                    />
                </div>

                <div className="col-md-4 d-flex align-items-end">
                    <button className="btn btn-primary w-100" onClick={cargarPedidos}>
                        Buscar
                    </button>
                </div>
            </div>
            <ul className="list-group">
                {pedidos.map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            Pedido #{p.id} - Cliente: {p.Cliente?.nombre} - Fecha: {p.fecha} - Total: ${p.total}
                        </div>
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={async () => {
                                if (window.confirm(`¿Seguro que deseas eliminar el pedido #${p.id}?`)) {
                                    try {
                                        await eliminarPedido(p.id);
                                        cargarPedidos();
                                    } catch (err: any) {
                                        alert(err.message || 'Error al eliminar el pedido');
                                    }
                                }
                            }}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PedidosPage;
