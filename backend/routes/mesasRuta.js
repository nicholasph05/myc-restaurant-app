const express = require('express');
const router = express.Router();
const { Mesa } = require('../models');
const {
  validarDatosMesa,
  validarDatosActualizacionMesa,
  validarMesaExistente,
} = require('../middlewares/validacionesMesas');

// Crear mesa
router.post('/',validarDatosMesa, async (req, res) => {
  try {
    const mesa = await Mesa.create(req.body);
    res.status(201).json(mesa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la mesa' });
  }
});

// Obtener todas las mesas
router.get('/', async (req, res) => {
  try {
    const mesas = await Mesa.findAll();
    res.json(mesas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las mesas' });
  }
});

// Obtener una mesa por ID
router.get('/:id',validarMesaExistente, async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).json({ message: 'Mesa no encontrada' });
    res.json(mesa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la mesa' });
  }
});

// Actualizar una mesa
router.put('/:id',validarMesaExistente,validarDatosActualizacionMesa, async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).json({ message: 'Mesa no encontrada' });

    await mesa.update(req.body);
    res.json(mesa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la mesa' });
  }
});

// Eliminar una mesa
router.delete('/:id',validarMesaExistente, async (req, res) => {
  try {
    const mesa = await Mesa.findByPk(req.params.id);
    if (!mesa) return res.status(404).json({ message: 'Mesa no encontrada' });

    await mesa.destroy();
    res.json({ message: 'Mesa eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la mesa' });
  }
});

module.exports = router;
