const express = require('express');
const router = express.Router();
const Historial = require('../models/historial_detallado');
const Cliente = require('../models/Cliente');  // ✅ corregido
const Plato = require('../models/Plato');      // ✅ corregido
const { Op } = require('sequelize');

// Crear nuevo pedido en historial
router.post('/', async (req, res) => {
  try {
    const { cliente_id, fecha, platos } = req.body;

    if (!cliente_id || !fecha || !Array.isArray(platos) || platos.length === 0) {
      return res.status(400).json({ error: 'Faltan datos obligatorios: cliente_id, fecha y platos' });
    }

    // 1. Verificar existencia del cliente en MySQL
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(404).json({ error: `Cliente con id ${cliente_id} no existe` });
    }

    // 2. Verificar que todos los nombres de los platos existan
    const nombresPlatos = platos.map(p => p.nombre);
    const platosExistentes = await Plato.findAll({
      where: {
        nombre: {
          [Op.in]: nombresPlatos
        }
      }
    });

    if (platosExistentes.length !== nombresPlatos.length) {
      const encontrados = platosExistentes.map(p => p.nombre);
      const faltantes = nombresPlatos.filter(n => !encontrados.includes(n));
      return res.status(400).json({ error: `Los siguientes platos no existen: ${faltantes.join(', ')}` });
    }

    // 3. Insertar el pedido en el historial de MongoDB
    const nuevoPedido = {
      fecha: new Date(fecha),
      platos
    };

    const historialActualizado = await Historial.findOneAndUpdate(
      { cliente_id: Number(cliente_id) },
      { $push: { pedidos: nuevoPedido } },
      { upsert: true, new: true }
    );

    res.status(201).json(historialActualizado);

  } catch (error) {
    console.error('Error al crear historial:', error);
    res.status(500).json({ error: 'Error al guardar pedido en historial' });
  }
});

// Consultar historial por cliente
router.get('/', async (req, res) => {
  try {
    const { cliente_id } = req.query;

    if (!cliente_id) {
      return res.status(400).json({ error: 'Se requiere cliente_id' });
    }

    const historial = await Historial.findOne({ cliente_id: Number(cliente_id) });

    if (!historial) {
      return res.status(404).json({ error: 'No hay historial registrado para este cliente' });
    }

    res.json(historial);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
});

module.exports = router;
