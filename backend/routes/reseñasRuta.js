const express = require('express');
const router = express.Router();
const Reseña = require('../models/reseña');
const {validarReseña} = require('../middlewares/validacionesReseñas');
const {validarPlatosExistentes} = require('../middlewares/validacionesPlatos');
const {validarClienteExiste}  = require('../middlewares/validacionesClientes'); 


// Función para limpiar los platos si vienen mal formateados
function limpiarPlatos(reseña) {
  if (reseña.platos_consumidos && Array.isArray(reseña.platos_consumidos)) {
    reseña.platos_consumidos = reseña.platos_consumidos.map(p => {
      if (typeof p === 'object' && !Array.isArray(p)) {
        return Object.values(p).join('');
      }
      return p;
    });
  }
  return reseña;
}

// Crear una reseña
router.post('/', validarReseña, validarClienteExiste, validarPlatosExistentes, async (req, res) => {
  try {
    const nuevaReseña = new Reseña(req.body);
    await nuevaReseña.save();
    res.status(201).json(nuevaReseña);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error al guardar la reseña', detalle: err.message });
  }
});

// Obtener todas las reseñas con filtros opcionales
router.get('/', async (req, res) => {
  try {
    const { cliente_id, calificacion, tipo_visita, fecha, plato } = req.query;

    const filtro = {};
    if (cliente_id) filtro.cliente_id = cliente_id;
    if (calificacion) filtro.calificacion = calificacion;
    if (tipo_visita) filtro.tipo_visita = tipo_visita;
    if (fecha) filtro.fecha = fecha;
    if (plato) filtro["platos_consumidos.nombre"] = { $regex: new RegExp(plato, 'i') };

    // Buscar reseñas con lean para objetos planos
    let reseñas = await Reseña.find(filtro).lean();

    // Función para normalizar platos_consumidos
    function limpiarPlatos(reseña) {
      if (!Array.isArray(reseña.platos_consumidos)) return reseña;
      reseña.platos_consumidos = reseña.platos_consumidos.map(p => {
        if (typeof p === 'string') {
          return { id: null, nombre: p };
        }
        return p;
      });
      return reseña;
    }

    // Normalizar platos_consumidos en cada reseña
    reseñas = reseñas.map(limpiarPlatos);

    // Filtrar por nombre del plato si se especificó
    if (plato) {
      const platoLower = plato.toLowerCase();
      reseñas = reseñas.filter(r =>
        r.platos_consumidos?.some(p =>
          p.nombre.toLowerCase().includes(platoLower)
        )
      );
    }

    res.json(reseñas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
});

// Obtener una reseña por ID
router.get('/:id', async (req, res) => {
  try {
    let reseña = await Reseña.findById(req.params.id).lean();
    if (!reseña) return res.status(404).json({ error: 'Reseña no encontrada' });

    reseña = limpiarPlatos(reseña);

    res.json(reseña);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar la reseña' });
  }
});

// Actualizar una reseña
router.put('/:id', async (req, res) => {
  try {
    let reseñaActualizada = await Reseña.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      lean: true
    });

    if (!reseñaActualizada) return res.status(404).json({ error: 'Reseña no encontrada' });

    reseñaActualizada = limpiarPlatos(reseñaActualizada);

    res.json(reseñaActualizada);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error al actualizar la reseña', detalle: err.message });
  }
});

// Eliminar una reseña
router.delete('/:id', async (req, res) => {
  try {
    const resultado = await Reseña.findByIdAndDelete(req.params.id);
    if (!resultado) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la reseña' });
  }
});

module.exports = router;
