const mongoose = require('../config/mongo'); // Asegúrate de que esta ruta sea correcta
require('dotenv').config();

// Cambia 'clientes' por el nombre real de tu colección
const reseñasSchema = new mongoose.Schema({}, { strict: false });
const Reseñas = mongoose.model('reseñas', reseñasSchema); // Nombre de la colección en MongoDB

async function run() {
  try {
    const resultados = await Reseñas.find();
    console.log('Documentos encontrados:', resultados);
  } catch (error) {
    console.error('Error al consultar MongoDB:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
