const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Mesa = sequelize.define('Mesa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'mesas',
  timestamps: false
});

module.exports = Mesa;
