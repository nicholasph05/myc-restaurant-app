const { Cliente, Pedido } = require('../models');

// Validar que un cliente exista por id
const validarClienteExiste = async (req, res, next) => {
  const id = req.params.id || req.body.cliente_id;
  const cliente = await Cliente.findByPk(id);
  if (!cliente) {
    // Este caso es crítico, mejor responder aquí mismo, no acumular error
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }
  next();
};

// Validar campos obligatorios al crear/actualizar cliente
const validarDatosCliente = async (req, res, next) => {
  if (!req.errors) req.errors = {};

  const { nombre, correo, telefono } = req.body;

  if (!nombre || nombre.trim() === '') {
    req.errors.nombre = 'El nombre es obligatorio.';
  }

  if (!correo || correo.trim() === '') {
    req.errors.correo = 'El correo es obligatorio.';
  } else {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    if (!emailValido) {
      req.errors.correo = 'El correo no tiene un formato válido.';
    }
  }

  if (telefono && !/^\d{7,15}$/.test(telefono)) {
    req.errors.telefono = 'El teléfono debe contener solo números y tener entre 7 y 15 dígitos.';
  }

  next();
};

// Validar email único
const validarEmailUnico = async (req, res, next) => {
  if (!req.errors) req.errors = {};

  const { correo } = req.body;
  if (!correo) return next();

  const clienteExistente = await Cliente.findOne({ where: { correo } });
  if (clienteExistente) {
    if (req.method === 'PUT' && clienteExistente.id != req.params.id) {
      req.errors.correo = 'Este correo ya está registrado por otro cliente.';
    }
    if (req.method === 'POST') {
      req.errors.correo = 'Este correo ya está registrado.';
    }
  }

  next();
};

// Validar que cliente no tenga pedidos antes de eliminar
const validarClienteSinPedidos = async (req, res, next) => {
  if (!req.errors) req.errors = {};

  const cliente_id = req.params.id;
  const pedidos = await Pedido.findAll({ where: { cliente_id } });

  if (pedidos.length > 0) {
    req.errors.general = 'No se puede eliminar un cliente con pedidos asociados.';
  }

  next();
};

// Middleware final para enviar errores acumulados
const enviarErrores = (req, res, next) => {
  if (req.errors && Object.keys(req.errors).length > 0) {
    return res.status(400).json({ errors: req.errors });
  }
  next();
};

module.exports = {
  validarClienteExiste,
  validarDatosCliente,
  validarEmailUnico,
  validarClienteSinPedidos,
  enviarErrores,
};
