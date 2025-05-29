const { Mesa } = require('../models'); // Asegúrate de que la ruta sea correcta

// Validar que los datos para crear una mesa sean correctos
const validarDatosMesa = (req, res, next) => {
  const { capacidad, ubicacion } = req.body;

  if (capacidad === undefined || ubicacion === undefined) {
    return res.status(400).json({ error: 'Capacidad y ubicación son obligatorias' });
  }

  if (!Number.isInteger(capacidad) || capacidad <= 0) {
    return res.status(400).json({ error: 'La capacidad debe ser un número entero positivo' });
  }

  if (typeof ubicacion !== 'string' || ubicacion.trim() === '') {
    return res.status(400).json({ error: 'La ubicación debe ser un texto no vacío' });
  }

  next();
};

// Validar que los datos al actualizar una mesa sean válidos
const validarDatosActualizacionMesa = (req, res, next) => {
  const { capacidad, ubicacion } = req.body;

  if (capacidad !== undefined) {
    if (!Number.isInteger(capacidad) || capacidad <= 0) {
      return res.status(400).json({ error: 'La capacidad debe ser un número entero positivo' });
    }
  }

  if (ubicacion !== undefined) {
    if (typeof ubicacion !== 'string' || ubicacion.trim() === '') {
      return res.status(400).json({ error: 'La ubicación debe ser un texto no vacío' });
    }
  }

  next();
};

// Validar que la mesa exista en base a su ID
const validarMesaExistente = async (req, res, next) => {
  const { id } = req.params;
  const mesa = await Mesa.findByPk(id);
  if (!mesa) {
    return res.status(404).json({ error: 'Mesa no encontrada' });
  }
  next();
};

module.exports = {
  validarDatosMesa,
  validarDatosActualizacionMesa,
  validarMesaExistente,
};