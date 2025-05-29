const express = require('express');
const router = express.Router();
const Reserva = require('../models/Reserva');
const { Op } = require('sequelize'); 

const {
  validarReservaCampos,
  validarReservaExistente
} = require('../middlewares/validacionesReservas');

const { crearReserva, obtenerReservas } = require('../controllers/reservasController');

// Crear reserva
router.post('/', validarReservaCampos, crearReserva);

// Obtener todas las reservas
router.get('/', obtenerReservas);

// Obtener reserva por ID
router.get('/:id', validarReservaExistente, async (req, res) => {
  res.json(req.reserva);
});

router.put('/:id', validarReservaExistente, validarReservaCampos, async (req, res) => {
  try {
    const { cliente_id, mesa_id, fecha, hora, personas } = req.body;

    // Validar que no haya otra reserva con misma mesa, fecha y hora (excluyendo esta misma)
const conflicto = await Reserva.findOne({
  where: {
    id: { [Op.ne]: Number(req.params.id) }, // convertir a número
    mesa_id,
    fecha,
    hora
  }
    });

    if (conflicto) {
      return res.status(400).json({
        errors: [{
          field: 'mesa_id',
          message: 'La mesa ya está ocupada en esa fecha y hora'
        }]
      });
    }

    await req.reserva.update({ cliente_id, mesa_id, fecha, hora, personas });
    res.json(req.reserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la reserva', message: error.message });
  }
});


// Eliminar reserva
router.delete('/:id', validarReservaExistente, async (req, res) => {
  try {
    await req.reserva.destroy();
    res.json({ mensaje: 'Reserva eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reserva', message: error.message });
  }
});

module.exports = router;
