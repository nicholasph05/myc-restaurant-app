const { Reserva, Cliente } = require('../models');

// Crear reserva
const crearReserva = async (req, res) => {
  const { cliente_id, mesa_id, fecha, hora, personas } = req.body;

  const existeReserva = await Reserva.findOne({
    where: { mesa_id, fecha, hora }
  });

  if (existeReserva) {
    return res.status(400).json({
      errors: [{ field: 'mesa_id', message: 'La mesa ya está ocupada en esa fecha y hora' }]
    });
  }

  try {
    const reserva = await Reserva.create({ cliente_id, mesa_id, fecha, hora, personas });

    const reservaConCliente = await Reserva.findByPk(reserva.id, {
      include: [{ model: Cliente, attributes: ['id', 'nombre'] }]
    });

    return res.status(201).json(reservaConCliente);
  } catch (error) {
    return res.status(500).json({
      error: 'Error al crear reserva',
      message: error.message
    });
  }
};

// Obtener reservas
const obtenerReservas = async (req, res) => {
  try {
    const { cliente_id, fecha } = req.query;
    const condiciones = {};
    if (cliente_id) condiciones.cliente_id = cliente_id;
    if (fecha) condiciones.fecha = fecha;

    const reservas = await Reserva.findAll({
      where: condiciones,
      include: [
        { model: Cliente, attributes: ['nombre'], required: true }
      ]
    });

    const resultado = reservas.map(r => ({
      id: r.id,
      cliente: r.Cliente.nombre,
      mesa_id: r.mesa_id,
      fecha: r.fecha,
      hora: r.hora,
      personas: r.personas
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener reservas',
      message: error.message
    });
  }
};

module.exports = {
  crearReserva,
  obtenerReservas
};
