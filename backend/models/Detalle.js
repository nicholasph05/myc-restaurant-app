const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DetallePedido = sequelize.define('DetallePedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  plato_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'pedido_detalle',
  timestamps: false
});

module.exports = DetallePedido;
