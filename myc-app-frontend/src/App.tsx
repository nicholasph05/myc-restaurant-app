import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import ClientesList from './components/Pages/ClientesList';
import ReservasPage from './components/Pages/ReservasPage';
import PlatosPage from './components/Pages/PlatosPage';
import PedidosPage from './components/Pages/PedidosPage';
import ReseñasPage from './components/ReseñaForm';
import ReseñasList from './components/Pages/ReseñasPage';
import PreferenciasPage from './components/Pages/PreferenciasPage';
import PreferenciasForm from './components/PreferenciasForm';
import HistorialForm from './components/HistorialForm';
import HistorialConsulta from './components/HistorialConsulta';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <Link className="navbar-brand" to="/">MyC App</Link>
        <div className="navbar-nav">
          <Link className="btn btn-outline-primary me-2" to="/clientes">Clientes</Link>
          <Link className="btn btn-outline-primary me-2" to="/reservas">Reservas</Link>
          <Link className="btn btn-outline-primary me-2" to="/platos">Platos</Link>
          <Link className="btn btn-outline-primary me-2" to="/pedidos">Pedidos</Link>
          <Link className="btn btn-outline-primary me-2" to="/reseñas">Enviar Reseñas</Link>
          <Link className="btn btn-outline-primary me-2" to="/ver-reseñas">Ver Reseñas</Link> {/* Nueva entrada */}
          <Link className="btn btn-outline-primary me-2" to="/form-preferencias">Agregar Preferencias</Link>
          <Link className="btn btn-outline-primary me-2" to="/preferencias">Preferencias</Link>
          <Link className="btn btn-outline-primary me-2" to="/historial/registrar">Registrar Pedido</Link>
          <Link className="btn btn-outline-primary me-2" to="/historial/consultar">Consultar Historial</Link>

        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<ClientesList />} />
          <Route path="/clientes" element={<ClientesList />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/platos" element={<PlatosPage />} />
          <Route path="/pedidos" element={<PedidosPage />} />
          <Route path="/reseñas" element={<ReseñasPage />} />
          <Route path="/ver-reseñas" element={<ReseñasList />} /> {/* Nueva ruta */}
          <Route path="/preferencias" element={<PreferenciasPage />} />
          <Route path="/form-preferencias" element={<PreferenciasForm />} />
          <Route path="/historial/registrar" element={<HistorialForm />} />
          <Route path="/historial/consultar" element={<HistorialConsulta />} />


        </Routes>
      </div>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
