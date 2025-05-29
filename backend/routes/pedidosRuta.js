const express = require('express');
const router = express.Router();
const { Pedido, Cliente, DetallePedido, Plato } = require('../models');
const {
  validarPedidoExistente,
  validarClienteExiste,
  validarPlatosEnDetalles,
  validarFiltrosPedidos,
  validarCamposActualizables,
} = require('../middlewares/validacionesPedidos');



router.get('/', async (req, res) => {
  try {
    const { cliente_id, fecha } = req.query;

    const whereClause = {};
    if (cliente_id) whereClause.cliente_id = cliente_id;
    if (fecha) whereClause.fecha = fecha;

    const pedidos = await Pedido.findAll({
      where: whereClause,
      include: [
        { model: DetallePedido, as: 'detalles', include: [Plato] },
        { model: Cliente }
      ]
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});



// Obtener un pedido por ID
router.get('/:id', validarPedidoExistente, async (req, res) => {
  try {
    const pedido = await Pedido.findOne({
      where: { id: req.params.id },
      include: [
        { model: Cliente },
        { model: DetallePedido, as: 'detalles', include: [Plato] }
      ],
    });

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el pedido' });
  }
});

router.post('/', validarClienteExiste, validarPlatosEnDetalles, async (req, res) => {
  try {
    let { cliente_id, fecha, detalles } = req.body;

    // Si no se envía la fecha, usar la del día actual
    if (!fecha) {
      fecha = new Date().toISOString().split('T')[0]; // formato YYYY-MM-DD
    }

    // Obtener los precios actuales de los platos
    // Obtener los precios actuales de los platos desde SQL
    const platosIds = detalles.map(d => d.plato_id);
    const platos = await Plato.findAll({ where: { id: platosIds } });

    // Crear mapa id → precio
    const mapaPrecios = {};
    platos.forEach(p => {
      mapaPrecios[p.id] = parseFloat(p.precio); // Asegura tipo numérico
    });

    // Calcular total con validación robusta
    let total = 0;
    for (const detalle of detalles) {
      const platoId = Number(detalle.plato_id);
      const cantidad = Number(detalle.cantidad);

      const precio = mapaPrecios[platoId];
      if (!precio) {
        return res.status(400).json({
          message: `El plato con ID ${platoId} no tiene precio válido o no fue encontrado.`
        });
      }

      if (isNaN(cantidad) || cantidad <= 0) {
        return res.status(400).json({
          message: `Cantidad inválida para plato con ID ${platoId}.`
        });
      }

      total += precio * cantidad;
    }

    console.log('Detalles:', detalles);
    console.log('Mapa de precios:', mapaPrecios);
    console.log('Total calculado:', total);


    // Crear el pedido con el total calculado
    const nuevoPedido = await Pedido.create({
      cliente_id,
      fecha,
      total,
      detalles
    }, {
      include: [{
        model: DetallePedido,
        as: 'detalles'
      }]
    });

    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el pedido con detalles', error: error.message });
  }
});


//ACTUALIZAR PEDIDO
router.put('/:id', validarClienteExiste, async (req, res) => {
  const pedidoId = req.params.id;
  const { cliente_id, fecha, total, detalles } = req.body;

  try {
    // 1. Actualizar datos básicos del pedido
    await Pedido.update(
      { cliente_id, fecha, total },
      { where: { id: pedidoId } }
    );

    // 2. Obtener todos los detalles actuales
    const detallesActuales = await DetallePedido.findAll({ where: { pedido_id: pedidoId } });

    // 3. Extraer IDs enviados por el cliente (si existen)
    const idsNuevos = detalles.filter(d => d.id).map(d => d.id);

    // 4. Eliminar los detalles que no están en la nueva lista
    for (const detalle of detallesActuales) {
      if (!idsNuevos.includes(detalle.id)) {
        await detalle.destroy();
      }
    }

    // 5. Crear nuevos o actualizar existentes
    for (const detalle of detalles) {
      if (detalle.id) {
        // Actualizar existente
        await DetallePedido.update(
          {
            plato_id: detalle.plato_id,
            cantidad: detalle.cantidad
          },
          {
            where: {
              id: detalle.id,
              pedido_id: pedidoId
            }
          }
        );
      } else {
        // Crear nuevo
        await DetallePedido.create({
          pedido_id: pedidoId,
          plato_id: detalle.plato_id,
          cantidad: detalle.cantidad
        });
      }
    }

    res.json({ message: 'Pedido actualizado y sincronizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al actualizar y sincronizar el pedido',
      error: error.message
    });
  }
});


// Eliminar un pedido por ID
router.delete('/:id', validarPedidoExistente, async (req, res) => {
  const pedidoId = req.params.id;

  try {
    // 1. Eliminar detalles del pedido
    await DetallePedido.destroy({ where: { pedido_id: pedidoId } });

    // 2. Eliminar el pedido principal
    await Pedido.destroy({ where: { id: pedidoId } });

    res.json({ message: 'Pedido y detalles eliminados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al eliminar el pedido',
      error: error.message
    });
  }
});



module.exports = router;
