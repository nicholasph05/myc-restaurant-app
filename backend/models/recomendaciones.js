const mongoose = require('mongoose');

const RecomendacionSchema = new mongoose.Schema({
  cliente_id: {
    type: Number,
    required: true,
    unique: true
  },
  recomendaciones_generadas: [
    {
      fecha: {
        type: String, // También puede ser Date si lo prefieres
        required: true
      },
      plato_recomendado: {
        type: String,
        required: true
      },
      razon: {
        type: String,
        required: true
      }
    }
  ]
}, { collection: 'recomendaciones' });

module.exports = mongoose.model('Recomendacion', RecomendacionSchema);
