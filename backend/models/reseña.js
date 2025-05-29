
const mongoose = require('mongoose');

const reseñaSchema = new mongoose.Schema({
  cliente_id: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  tipo_visita: {
    type: String,
    enum: ['Desayuno', 'Almuerzo', 'Cena', 'Evento', 'Otro'],
    required: true
  },
  platos_consumidos: [{
    id: Number,
    nombre: String
  }],
  comentario: {
    type: String,
    default: ''
  },
  calificacion: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
});

module.exports = mongoose.model('Reseña', reseñaSchema);
