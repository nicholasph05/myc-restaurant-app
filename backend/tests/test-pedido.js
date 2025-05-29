// test-pedido.js
const { Pedido, Cliente, DetallePedido, Plato } = require('../models');

async function testPedidoConDetalles() {
  try {
    const pedido = await Pedido.findOne({
      where: { id: 1 },  // o el id que quieras probar
      include: [
        { model: Cliente },
        { model: DetallePedido, include: [Plato] },
      ],
    });

    console.log(JSON.stringify(pedido, null, 2));
  } catch (error) {
    console.error('Error al obtener pedido:', error);
  }
}

testPedidoConDetalles();
