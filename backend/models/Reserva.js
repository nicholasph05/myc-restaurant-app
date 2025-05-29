const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mesa_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME,
    allowNull: false
  },
  personas: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'reservas',
  timestamps: false
});

module.exports = Reserva;
