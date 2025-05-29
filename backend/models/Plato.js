const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Plato = sequelize.define('Plato', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  disponibilidad: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}, {
  tableName: 'platos',
  timestamps: false
});

module.exports = Plato;
