import React, { useEffect, useState } from 'react';

interface Preferencia {
    cliente_id: number;
    nombre_cliente?: string;
    intolerancias: string[];
    estilos_preferidos: string[];
    platos_favoritos: string[];
}

const PreferenciasPage: React.FC = () => {
    const [preferencias, setPreferencias] = useState<Preferencia[]>([]);
    const [nombreFiltro, setNombreFiltro] = useState('');
    const [error, setError] = useState('');

    const cargarPreferencias = async (nombre: string = '') => {
        try {
            setError('');
            const url = nombre
                ? `http://localhost:3000/api/preferencias?nombre=${encodeURIComponent(nombre)}`
                : 'http://localhost:3000/api/preferencias';

            const res = await fetch(url);
            if (!res.ok) throw await res.json();
            const data = await res.json();
            setPreferencias(data);
        } catch (err: any) {
            setError(err?.error || 'Error al cargar preferencias');
        }
    };

    // Búsqueda automática con debounce
    useEffect(() => {
        const delay = setTimeout(() => {
            cargarPreferencias(nombreFiltro);
        }, 500);

        return () => clearTimeout(delay);
    }, [nombreFiltro]);

    // Cargar todo al principio
    useEffect(() => {
        cargarPreferencias();
    }, []);

    return (
        <div>
            <h2>Preferencias de Clientes</h2>

            <div className="card p-3 mb-3 shadow-sm">
                <h5>Filtrar por Nombre de Cliente</h5>
                <div className="row">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre del Cliente"
                            value={nombreFiltro}
                            onChange={(e) => setNombreFiltro(e.target.value)}
                        />
                    </div>
                </div>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>

            {preferencias.length === 0 ? (
                <p>No hay preferencias registradas.</p>
            ) : (
                <ul className="list-group">
                    {preferencias.map((pref) => (
                        <li key={pref.cliente_id} className="list-group-item">
                            <strong>Cliente:</strong> {pref.nombre_cliente || 'Sin nombre'} (ID: {pref.cliente_id})<br />
                            <strong>Intolerancias:</strong> {pref.intolerancias.join(', ') || 'Ninguna'}<br />
                            <strong>Estilos Preferidos:</strong> {pref.estilos_preferidos.join(', ') || 'Ninguno'}<br />
                            <strong>Platos Favoritos:</strong> {pref.platos_favoritos.join(', ') || 'Ninguno'}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PreferenciasPage;
