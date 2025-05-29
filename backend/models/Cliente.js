const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'clientes',
  timestamps: false,
});

module.exports = Cliente;
