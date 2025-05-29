const { Plato } = require('../models'); // Ajusta la ruta si es necesario

// Validar datos obligatorios al crear un plato
const validarDatosPlato = (req, res, next) => {
  const { nombre, categoria, precio } = req.body;

  if (!nombre || !categoria || precio === undefined) {
    return res.status(400).json({ error: 'Nombre, categoría y precio son obligatorios' });
  }

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre debe ser un texto no vacío' });
  }

  if (typeof categoria !== 'string' || categoria.trim() === '') {
    return res.status(400).json({ error: 'La categoría debe ser un texto no vacío' });
  }

  if (typeof precio !== 'number' || precio <= 0) {
    return res.status(400).json({ error: 'El precio debe ser un número positivo' });
  }

  next();
};

// Validar campos al actualizar un plato
const validarDatosActualizacionPlato = (req, res, next) => {
  const { nombre, categoria, precio, disponibilidad } = req.body;

  if (!nombre || !categoria || precio === undefined) {
    return res.status(400).json({ error: 'Nombre, categoría y precio son obligatorios' });
  }

  if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
    return res.status(400).json({ error: 'El nombre debe ser un texto no vacío' });
  }

  if (categoria !== undefined && (typeof categoria !== 'string' || categoria.trim() === '')) {
    return res.status(400).json({ error: 'La categoría debe ser un texto no vacío' });
  }

  if (precio !== undefined && (typeof precio !== 'number' || precio <= 0)) {
    return res.status(400).json({ error: 'El precio debe ser un número positivo' });
  }

  if (disponibilidad !== undefined && typeof disponibilidad !== 'boolean') {
    return res.status(400).json({ error: 'Disponibilidad debe ser true o false' });
  }

  next();
};

// Validar existencia del plato por ID
const validarPlatoExistente = async (req, res, next) => {
  const { id } = req.params;
  const plato = await Plato.findByPk(id);
  if (!plato) {
    return res.status(404).json({ error: 'Plato no encontrado' });
  }
  next();
};

// Validar que el nombre del plato sea único
const validarNombrePlatoUnico = async (req, res, next) => {
  const { nombre } = req.body;

  // Si no se está actualizando el nombre, continuar
  if (!nombre) return next();

  const platoExistente = await Plato.findOne({ where: { nombre } });

  // En POST: no permitir si ya existe
  if (req.method === 'POST' && platoExistente) {
    return res.status(400).json({ error: 'Ya existe un plato con este nombre' });
  }

  // En PUT: permitir solo si es el mismo plato que se está actualizando
  if (req.method === 'PUT' && platoExistente && platoExistente.id != req.params.id) {
    return res.status(400).json({ error: 'Este nombre ya está en uso por otro plato' });
  }

  next();
};


const validarPlatosExistentes = async (req, res, next) => {
  const { platos_consumidos } = req.body;

  if (!Array.isArray(platos_consumidos) || platos_consumidos.length === 0) {
    return res.status(400).json({ error: 'Debe enviar un arreglo con los platos consumidos' });
  }

  // Opcional: si platos_consumidos tiene objetos con id, extraemos los ids
  const ids = platos_consumidos.map(p => p.id);

  // Consultar si todos los platos existen
  const platosEncontrados = await Plato.findAll({
    where: {
      id: ids
    }
  });

  if (platosEncontrados.length !== ids.length) {
    return res.status(400).json({ error: 'Alguno(s) de los platos consumidos no existen' });
  }

  next();
};



module.exports = {
  // ...otras validaciones
  validarDatosPlato,
  validarDatosActualizacionPlato,
  validarPlatoExistente,
  validarNombrePlatoUnico,
  validarPlatosExistentes,
};
