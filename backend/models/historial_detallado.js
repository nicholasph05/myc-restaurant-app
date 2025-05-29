const mongoose = require('mongoose');

const PlatoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  observacion: { type: String }
}, { _id: false });

const PedidoSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  platos: { type: [PlatoSchema], required: true }
}, { _id: false });

const HistorialPedidosDetalladoSchema = new mongoose.Schema({
  cliente_id: { type: Number, required: true }, // Relacionado con cliente SQL
  pedidos: { type: [PedidoSchema], required: true }
});

module.exports = mongoose.model(
  'HistorialPedidosDetallado',
  HistorialPedidosDetalladoSchema,
  'historial_pedidos_detallado' // <- Nombre exacto de la colección en MongoDB
);