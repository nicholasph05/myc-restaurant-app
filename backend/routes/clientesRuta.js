const express = require('express');
const router = express.Router();
const { Cliente } = require('../models');
const {
  validarClienteExiste,
  validarDatosCliente,
  validarEmailUnico,
  validarClienteSinPedidos,
  enviarErrores
} = require('../middlewares/validacionesClientes');

// Crear cliente
router.post(
  '/',
  validarDatosCliente,
  validarEmailUnico,
  enviarErrores,
  async (req, res) => {
    try {
      const cliente = await Cliente.create(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el cliente' });
    }
  }
);

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los clientes' });
  }
});

// Obtener cliente por ID
router.get('/:id', validarClienteExiste, async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el cliente' });
  }
});

// Actualizar cliente
router.put(
  '/:id',
  validarClienteExiste,
  validarDatosCliente,
  validarEmailUnico,
  enviarErrores,
  async (req, res) => {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      await cliente.update(req.body);
      res.json(cliente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
  }
);

// Eliminar cliente (validando que no tenga pedidos)
router.delete(
  '/:id',
  validarClienteExiste,
  validarClienteSinPedidos,
  enviarErrores,
  async (req, res) => {
    try {
      const cliente = await Cliente.findByPk(req.params.id);
      await cliente.destroy();
      res.json({ message: 'Cliente eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el cliente' });
    }
  }
);

module.exports = router;
