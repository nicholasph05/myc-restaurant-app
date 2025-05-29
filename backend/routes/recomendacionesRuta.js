const express = require('express');
const router = express.Router();
const Recomendacion = require('../models/recomendaciones');

// Crear o actualizar recomendaciones para un cliente
router.post('/', async (req, res) => {
  try {
    const { cliente_id, recomendaciones_generadas } = req.body;

    const doc = await Recomendacion.findOneAndUpdate(
      { cliente_id },
      { $set: { recomendaciones_generadas } },
      { upsert: true, new: true }
    );

    res.status(200).json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar las recomendaciones' });
  }
});

// Obtener recomendaciones por cliente_id
router.get('/:cliente_id', async (req, res) => {
  try {
    const doc = await Recomendacion.findOne({ cliente_id: req.params.cliente_id });
    if (!doc) return res.status(404).json({ error: 'No se encontraron recomendaciones' });

    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener recomendaciones' });
  }
});

// Eliminar recomendaciones por cliente_id
router.delete('/:cliente_id', async (req, res) => {
  try {
    const resultado = await Recomendacion.deleteOne({ cliente_id: req.params.cliente_id });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ error: 'No se encontraron recomendaciones para eliminar' });
    }

    res.status(200).json({ message: 'Recomendaciones eliminadas' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar las recomendaciones' });
  }
});

module.exports = router;
