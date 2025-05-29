const express = require('express');
require('dotenv').config();
require('./config/mongo');
const sequelize = require('./config/sequelize'); // si usas sequelize para MySQL
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Importa las rutas
const resenasRoutes = require('./routes/reseñasRuta');
const clientesRoutes = require('./routes/clientesRuta');
const pedidosRoutes = require('./routes/pedidosRuta');
const platosRoutes = require('./routes/platosRuta');
const mesasRoutes = require('./routes/mesasRuta');
const detallesRoutes= require('./routes/detallesRuta');
const historialRuta = require('./routes/historialRuta');
const preferenciasRuta = require('./routes/preferenciasRuta');
const recomendacionesRuta = require('./routes/recomendacionesRuta');
const reservasRoute = require('./routes/reservasRuta');

// Usa las rutas con prefijo
app.use('/api/resenas', resenasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/platos', platosRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/detalles',detallesRoutes);
app.use('/api/historial', historialRuta);
app.use('/api/preferencias', preferenciasRuta);
app.use('/api/recomendaciones', recomendacionesRuta);
app.use('/api/reservas',reservasRoute);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL con Sequelize exitosa');

    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
  }
}

startServer();
