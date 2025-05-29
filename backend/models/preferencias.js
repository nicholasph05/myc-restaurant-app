const mongoose = require('mongoose');

const PreferenciasClienteSchema = new mongoose.Schema({
  cliente_id: {
    type: Number,
    required: true,
    unique: true
  },
  intolerancias: {
    type: [String],
    default: []
  },
  estilos_preferidos: {
    type: [String],
    default: []
  },
  platos_favoritos: {
    type: [String],
    default: []
  }
}, { collection: 'preferencias_clientes' });

module.exports = mongoose.model('PreferenciasCliente', PreferenciasClienteSchema);
