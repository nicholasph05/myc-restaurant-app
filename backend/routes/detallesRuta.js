const express = require('express');
const router = express.Router();
const { DetallePedido ,Pedido} = require('../models');

// OBTENER TODOS LOS DETALLES DE PEDIDO
router.get('/', async (req, res) => {
  try {
    const detalles = await DetallePedido.findAll();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los detalles de pedido', error: error.message });
  }
});

// OBTENER UN DETALLE POR ID
router.get('/:id', async (req, res) => {
  try {
    const detalle = await DetallePedido.findByPk(req.params.id);
    if (detalle) {
      res.json(detalle);
    } else {
      res.status(404).json({ message: 'Detalle no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar el detalle', error: error.message });
  }
});

// CREAR NUEVO DETALLE PARA UN PEDIDO
router.post('/', async (req, res) => {
  const { pedido_id, plato_id, cantidad } = req.body;

  try {
    // Verificar que el pedido exista
    const pedido = await Pedido.findByPk(pedido_id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado. No se puede agregar detalle.' });
    }

    // Crear el nuevo detalle
    const nuevoDetalle = await DetallePedido.create({
      pedido_id,
      plato_id,
      cantidad
    });

    res.status(201).json({
      message: 'Detalle agregado correctamente al pedido',
      detalle: nuevoDetalle
    });
  } catch (error) {
    console.error('Error al crear detalle de pedido:', error);
    res.status(500).json({
      message: 'Error al crear el detalle de pedido',
      error: error.message
    });
  }
});

// ACTUALIZAR UN DETALLE EXISTENTE
router.put('/:id', async (req, res) => {
  const { pedido_id, plato_id, cantidad } = req.body;

  try {
    const [filasActualizadas] = await DetallePedido.update(
      { pedido_id, plato_id, cantidad },
      { where: { id: req.params.id } }
    );

    if (filasActualizadas) {
      res.json({ message: 'Detalle actualizado correctamente' });
    } else {
      res.status(404).json({ message: 'Detalle no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el detalle', error: error.message });
  }
});

// ELIMINAR UN DETALLE
router.delete('/:id', async (req, res) => {
  try {
    const filasEliminadas = await DetallePedido.destroy({ where: { id: req.params.id } });

    if (filasEliminadas) {
      res.json({ message: 'Detalle eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Detalle no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el detalle', error: error.message });
  }
});

module.exports = router;
