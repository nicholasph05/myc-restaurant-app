const Cliente = require('./Cliente');
const Mesa = require('./Mesa');
const Pedido = require('./Pedido');
const DetallePedido = require('./Detalle');
const Plato = require('./Plato');
const Reserva = require('./Reserva');

// Cliente - Pedido
Cliente.hasMany(Pedido, { foreignKey: 'cliente_id' });
Pedido.belongsTo(Cliente, { foreignKey: 'cliente_id' });

// Pedido - DetallePedido
Pedido.hasMany(DetallePedido, { as:'detalles',foreignKey: 'pedido_id' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

// Plato - DetallePedido
Plato.hasMany(DetallePedido, { foreignKey: 'plato_id' });
DetallePedido.belongsTo(Plato, { foreignKey: 'plato_id' });

// Cliente - Reserva
Cliente.hasMany(Reserva, { foreignKey: 'cliente_id' });
Reserva.belongsTo(Cliente, { foreignKey: 'cliente_id' });

// Mesa - Reserva
Mesa.hasMany(Reserva, { foreignKey: 'mesa_id' });
Reserva.belongsTo(Mesa, { foreignKey: 'mesa_id' });

module.exports = {
  Cliente,
  Mesa,
  Pedido,
  DetallePedido,
  Plato,
  Reserva,
};
