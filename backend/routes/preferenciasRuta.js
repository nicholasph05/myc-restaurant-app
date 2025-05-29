const express = require('express');
const router = express.Router();
const PreferenciasCliente = require('../models/preferencias'); // MongoDB
const Plato = require('../models/Plato'); // Sequelize
const Cliente = require('../models/Cliente'); // Sequelize

// Importaciones necesarias de Sequelize
const { Op, fn, col } = require('sequelize');
const Sequelize = require('sequelize');

// Crear o actualizar preferencias
router.post('/', async (req, res) => {
  try {
    const { cliente_id, intolerancias, estilos_preferidos, platos_favoritos } = req.body;

    // Verifica que el cliente exista en SQL
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(404).json({ error: 'El cliente no existe' });
    }

    // Verifica que todos los platos favoritos existan en SQL
    if (platos_favoritos && platos_favoritos.length > 0) {
      const platosExistentes = await Plato.findAll({
        where: {
          nombre: platos_favoritos
        }
      });

      const nombresValidos = platosExistentes.map(p => p.nombre);
      const platosInvalidos = platos_favoritos.filter(p => !nombresValidos.includes(p));

      if (platosInvalidos.length > 0) {
        return res.status(400).json({
          error: 'Los siguientes platos no existen',
          platos_no_encontrados: platosInvalidos
        });
      }
    }

    console.log('Guardando preferencias para cliente_id:', cliente_id);

    // Crear o actualizar las preferencias en MongoDB
    const preferencias = await PreferenciasCliente.findOneAndUpdate(
      { cliente_id: Number(cliente_id) }, // Aseguramos tipo Number
      { $set: { intolerancias, estilos_preferidos, platos_favoritos } },
      { upsert: true, new: true }
    );

    console.log('Preferencias guardadas:', preferencias);
    res.status(200).json(preferencias);
  } catch (error) {
    console.error('Error al guardar las preferencias:', error);
    res.status(500).json({ error: 'Error al guardar las preferencias' });
  }
});

// GET /api/preferencias?cliente_id=123 o ?nombre=Nicholas
router.get('/', async (req, res) => {
  try {
    const { cliente_id, nombre } = req.query;
    const filtro = {};
    let clientes = [];

    // Filtro por ID
    if (cliente_id) {
      filtro.cliente_id = Number(cliente_id);
    }

    // Filtro por nombre (búsqueda parcial e insensible a mayúsculas)
    if (nombre) {
      clientes = await Cliente.findAll({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('nombre')),
          {
            [Op.like]: `%${nombre.toLowerCase()}%`
          }
        )
      });

      if (clientes.length === 0) {
        return res.json([]);
      }

      const ids = clientes.map(c => c.id);
      filtro.cliente_id = { $in: ids };
    }

    // Buscar preferencias en Mongo
    const preferencias = await PreferenciasCliente.find(filtro);

    // Si aún no se han cargado clientes, obtenerlos por ID
    if (clientes.length === 0 && preferencias.length > 0) {
      const ids = preferencias.map(p => p.cliente_id);
      clientes = await Cliente.findAll({ where: { id: ids } });
    }

    // Mapa cliente_id → nombre
    const mapaClientes = {};
    clientes.forEach(c => {
      mapaClientes[c.id] = c.nombre;
    });

    // Agregar nombre_cliente a cada preferencia
    const resultado = preferencias.map(pref => ({
      ...pref.toObject(),
      nombre_cliente: mapaClientes[pref.cliente_id] || 'Desconocido'
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener preferencias:', error);
    res.status(500).json({ error: 'Error al obtener las preferencias' });
  }
});

module.exports = router;
