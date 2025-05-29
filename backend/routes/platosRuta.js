const express = require('express');
const { Op, fn, col, where } = require('sequelize');
const router = express.Router();
const { Plato } = require('../models');

const {
  validarDatosPlato,
  validarDatosActualizacionPlato,
  validarPlatoExistente,
  validarNombrePlatoUnico,
} = require('../middlewares/validacionesPlatos');

// Obtener todos los platos
router.get('/', async (req, res) => {
  try {
    const { nombre, categoria, disponibilidad } = req.query;
    const condiciones = [];

    if (nombre) {
      condiciones.push({
        nombre: { [Op.like]: `%${nombre}%` }
      });
    }

    if (disponibilidad !== undefined) {
      condiciones.push({
        disponibilidad: disponibilidad === 'true'
      });
    }

    if (categoria) {
      condiciones.push(
        where(fn('LOWER', col('categoria')), categoria.toLowerCase())
      );
    }

    const platos = await Plato.findAll({
      where: condiciones.length > 0 ? { [Op.and]: condiciones } : undefined,
    });

    res.json(platos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los platos' });
  }
});

// Obtener categorías únicas
router.get('/categorias/unicas', async (req, res) => {
  try {
    const categorias = await Plato.findAll({
      attributes: [
        [fn('DISTINCT', col('categoria')), 'categoria']
      ],
      raw: true
    });

    const nombres = categorias
      .map(c => c.categoria)
      .filter(c => c); // elimina null/undefined

    res.json(nombres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

// Obtener un plato por ID
router.get('/:id', validarPlatoExistente, async (req, res) => {
  try {
    const plato = await Plato.findByPk(req.params.id);
    if (!plato) {
      return res.status(404).json({ message: 'Plato no encontrado' });
    }
    res.json(plato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el plato' });
  }
});

// Crear un nuevo plato
router.post('/', validarNombrePlatoUnico, validarDatosPlato, async (req, res) => {
  try {
    const nuevoPlato = await Plato.create(req.body);
    res.status(201).json(nuevoPlato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el plato' });
  }
});

// Actualizar un plato
router.put('/:id', validarNombrePlatoUnico, validarPlatoExistente, validarDatosActualizacionPlato, async (req, res) => {
  try {
    const plato = await Plato.findByPk(req.params.id);
    if (!plato) {
      return res.status(404).json({ message: 'Plato no encontrado' });
    }
    await plato.update(req.body);
    res.json(plato);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el plato' });
  }
});

// Eliminar un plato
router.delete('/:id', validarPlatoExistente, async (req, res) => {
  try {
    const plato = await Plato.findByPk(req.params.id);
    if (!plato) {
      return res.status(404).json({ message: 'Plato no encontrado' });
    }
    await plato.destroy();
    res.json({ message: 'Plato eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el plato' });
  }
});



module.exports = router;
