import React, { useEffect, useState } from 'react';
import { obtenerClientes } from '../services/clienteService';
import { obtenerPlatos } from '../services/platoService';
import { crearReseña } from '../services/reseñaService';

interface Cliente {
    id: number;
    nombre: string;
}

interface Plato {
    id: number;
    nombre: string;
    categoria: string;
}

interface PlatoSeleccionado {
    id: number;
    nombre: string;
}

interface FormularioResena {
    cliente_id: number;
    fecha: string;
    tipo_visita: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Evento' | 'Otro';
    platos_consumidos: PlatoSeleccionado[];
    comentario: string;
    calificacion: number;
}

const ResenaForm: React.FC = () => {
    const [form, setForm] = useState<FormularioResena>({
        cliente_id: 0,
        fecha: new Date().toISOString().split('T')[0],
        tipo_visita: 'Almuerzo',
        platos_consumidos: [],
        comentario: '',
        calificacion: 3
    });

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [errores, setErrores] = useState<Record<string, string>>({});

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const clientes = await obtenerClientes();
                const platos = await obtenerPlatos();
                setClientes(clientes);
                setPlatos(platos);

                const cats: string[] = Array.from(new Set(platos.map((p: Plato) => p.categoria)));
                setCategorias(cats);
            } catch (error) {
                console.error('Error cargando datos:', error);
            }
        };
        cargarDatos();
    }, []);

    const platosFiltrados = categoriaSeleccionada
        ? platos.filter(p => p.categoria === categoriaSeleccionada)
        : [];

    const agregarPlato = (plato: Plato) => {
        if (!form.platos_consumidos.find(p => p.id === plato.id)) {
            setForm({
                ...form,
                platos_consumidos: [...form.platos_consumidos, { id: plato.id, nombre: plato.nombre }]
            });
        }
    };

    const quitarPlato = (id: number) => {
        setForm({
            ...form,
            platos_consumidos: form.platos_consumidos.filter(p => p.id !== id)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrores({});

        const nuevosErrores: Record<string, string> = {};
        if (!form.cliente_id) nuevosErrores.cliente_id = 'Seleccione un cliente';
        if (!form.tipo_visita) nuevosErrores.tipo_visita = 'Seleccione tipo de visita';
        if (!form.calificacion || form.calificacion < 1 || form.calificacion > 5)
            nuevosErrores.calificacion = 'La calificación debe estar entre 1 y 5';
        if (!form.platos_consumidos.length)
            nuevosErrores.platos_consumidos = 'Debe seleccionar al menos un plato';

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        try {
            await crearReseña(form);
            alert('Reseña registrada exitosamente');
            setForm({
                cliente_id: 0,
                fecha: new Date().toISOString().split('T')[0],
                tipo_visita: 'Almuerzo',
                platos_consumidos: [],
                comentario: '',
                calificacion: 3
            });
            setCategoriaSeleccionada('');
        } catch (err: any) {
            if (err.errors) {
                const errMap: Record<string, string> = {};
                err.errors.forEach((e: any) => (errMap[e.param] = e.msg));
                setErrores(errMap);
            } else {
                alert(err.message || 'Error al enviar reseña');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
            <h4 className="mb-3">Nueva Reseña</h4>

            <div className="mb-3">
                <label className="form-label">Cliente</label>
                <select
                    className={`form-select ${errores.cliente_id ? 'is-invalid' : ''}`}
                    value={form.cliente_id}
                    onChange={(e) => setForm({ ...form, cliente_id: Number(e.target.value) })}
                >
                    <option value={0}>Seleccione un cliente</option>
                    {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                {errores.cliente_id && <div className="invalid-feedback d-block">{errores.cliente_id}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Tipo de visita</label>
                <select
                    className="form-select"
                    value={form.tipo_visita}
                    onChange={(e) => setForm({ ...form, tipo_visita: e.target.value as FormularioResena['tipo_visita'] })}
                >
                    <option value="Desayuno">Desayuno</option>
                    <option value="Almuerzo">Almuerzo</option>
                    <option value="Cena">Cena</option>
                    <option value="Evento">Evento</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Filtrar por categoría</label>
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
                <label className="form-label">Platos disponibles</label>
                {platosFiltrados.map(p => (
                    <div key={p.id} className="d-flex justify-content-between align-items-center mb-1">
                        <span>{p.nombre}</span>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => agregarPlato(p)}
                        >
                            Agregar
                        </button>
                    </div>
                ))}
                {errores.platos_consumidos && (
                    <div className="invalid-feedback d-block">{errores.platos_consumidos}</div>
                )}
            </div>

            <div className="mb-3">
                <label className="form-label">Platos seleccionados</label>
                {form.platos_consumidos.map(p => (
                    <div key={p.id} className="d-flex justify-content-between align-items-center mb-1">
                        <span>{p.nombre}</span>
                        <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => quitarPlato(p.id)}
                        >
                            Quitar
                        </button>
                    </div>
                ))}
            </div>

            <div className="mb-3">
                <label className="form-label">Comentario</label>
                <textarea
                    className="form-control"
                    value={form.comentario}
                    onChange={(e) => setForm({ ...form, comentario: e.target.value })}
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Calificación (1 a 5 estrellas)</label>
                <input
                    type="number"
                    className={`form-control ${errores.calificacion ? 'is-invalid' : ''}`}
                    value={form.calificacion}
                    onChange={(e) => setForm({ ...form, calificacion: parseInt(e.target.value) || 0 })}
                    min={1}
                    max={5}
                />
                {errores.calificacion && <div className="invalid-feedback d-block">{errores.calificacion}</div>}
            </div>

            <button type="submit" className="btn btn-primary">Guardar Reseña</button>
        </form>
    );
};

export default ResenaForm;
