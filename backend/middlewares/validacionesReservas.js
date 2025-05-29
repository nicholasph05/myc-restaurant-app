const Reserva = require('../models/Reserva');
const Cliente = require('../models/Cliente');
const Mesa = require('../models/Mesa');
const { Op } = require('sequelize');

const validarReservaCampos = async (req, res, next) => {
  const { cliente_id, mesa_id, fecha, hora, personas } = req.body;
  const errors = [];

  // Validaciones básicas
  if (!cliente_id) errors.push({ field: 'cliente_id', message: 'Cliente_id es obligatorio' });
  if (!mesa_id) errors.push({ field: 'mesa_id', message: 'Mesa_id es obligatorio' });
  if (!fecha) errors.push({ field: 'fecha', message: 'Fecha es obligatoria' });
  if (!hora) errors.push({ field: 'hora', message: 'Hora es obligatoria' });
  if (!personas) errors.push({ field: 'personas', message: 'Número de personas es obligatorio' });

  try {
    // Validar existencia de cliente
    if (cliente_id) {
      const cliente = await Cliente.findByPk(cliente_id);
      if (!cliente) {
        errors.push({ field: 'cliente_id', message: 'Cliente no existe' });
      }
    }

    // Validar existencia de mesa y su capacidad
    let mesa = null;
    if (mesa_id) {
      mesa = await Mesa.findByPk(mesa_id);
      if (!mesa) {
        errors.push({ field: 'mesa_id', message: 'Mesa no existe' });
      } else if (personas && personas > mesa.capacidad) {
        errors.push({
          field: 'personas',
          message: `La mesa seleccionada tiene una capacidad máxima de ${mesa.capacidad} personas`
        });
      }
    }

    // Validar que no haya otra reserva en la misma mesa, fecha y hora
    if (mesa_id && fecha && hora) {
      const condiciones = {
        mesa_id,
        fecha,
        hora
      };

      // Si estamos editando (PUT), excluir la reserva actual
      if (req.params.id) {
        condiciones.id = { [Op.ne]: req.params.id };
      }

      const reservaExistente = await Reserva.findOne({ where: condiciones });
      if (reservaExistente) {
        errors.push({
          field: 'mesa_id',
          message: 'La mesa ya está ocupada en esa fecha y hora'
        });
      }
    }

  } catch (error) {
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validarReservaExistente = async (req, res, next) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    req.reserva = reserva;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la reserva', message: error.message });
  }
};

module.exports = {
  validarReservaCampos,
  validarReservaExistente
};
