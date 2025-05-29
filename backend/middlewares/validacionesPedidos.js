const { Pedido, Cliente, DetallePedido, Plato } = require('../models'); // Ajusta la ruta según tu estructura

// Validar que el ID del pedido sea un número y que el pedido exista
async function validarPedidoExistente(req, res, next) {
  const pedidoId = req.params.id;
  if (isNaN(pedidoId)) {
    return res.status(400).json({ error: 'El ID del pedido debe ser un número válido.' });
  }
  try {
    const pedido = await Pedido.findByPk(pedidoId);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado.' });
    }
    req.pedido = pedido; // guardamos el pedido para que se use después si es necesario
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error validando el pedido.' });
  }
}

// Validar que el cliente existe (usado en creación y actualización)
async function validarClienteExiste(req, res, next) {
  const { cliente_id } = req.body;
  if (!cliente_id) {
    return res.status(400).json({ error: 'El campo cliente_id es obligatorio.' });
  }
  try {
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
      return res.status(400).json({ error: 'El cliente no existe.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error validando el cliente.' });
  }
}

// Validar que los platos en detalles existan (para creación o actualización de pedidos)
async function validarPlatosEnDetalles(req, res, next) {
  const detalles = req.body.detalles;
  if (!Array.isArray(detalles) || detalles.length === 0) {
    return res.status(400).json({ error: 'Debe enviar un arreglo no vacío de detalles con platos.' });
  }

  try {
    for (const detalle of detalles) {
      if (!detalle.plato_id) {
        return res.status(400).json({ error: 'Cada detalle debe contener plato_id.' });
      }
      const plato = await Plato.findByPk(detalle.plato_id);
      if (!plato) {
        return res.status(400).json({ error: `El plato con id ${detalle.plato_id} no existe.` });
      }
      if (!detalle.cantidad || detalle.cantidad <= 0) {
        return res.status(400).json({ error: `La cantidad para el plato ${detalle.plato_id} debe ser mayor a 0.` });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error validando los platos en detalles.' });
  }
}

// Validar parámetros de filtro para GET /pedidos (opcional, si usas filtros)
function validarFiltrosPedidos(req, res, next) {
  const { cliente_id, fecha_inicio, fecha_fin } = req.query;

  if (cliente_id && isNaN(cliente_id)) {
    return res.status(400).json({ error: 'cliente_id debe ser un número válido.' });
  }

  if (fecha_inicio && isNaN(Date.parse(fecha_inicio))) {
    return res.status(400).json({ error: 'fecha_inicio debe ser una fecha válida.' });
  }

  if (fecha_fin && isNaN(Date.parse(fecha_fin))) {
    return res.status(400).json({ error: 'fecha_fin debe ser una fecha válida.' });
  }

  // Si ambos fechas existen, validar que fecha_inicio <= fecha_fin
  if (fecha_inicio && fecha_fin && new Date(fecha_inicio) > new Date(fecha_fin)) {
    return res.status(400).json({ error: 'fecha_inicio no puede ser mayor que fecha_fin.' });
  }

  next();
}

// Evitar modificar campos no permitidos en PUT/PATCH
function validarCamposActualizables(req, res, next) {
  const camposProhibidos = ['id', 'createdAt', 'updatedAt'];
  for (const campo of camposProhibidos) {
    if (campo in req.body) {
      return res.status(400).json({ error: `No está permitido modificar el campo ${campo}.` });
    }
  }
  next();
}

module.exports = {
  validarPedidoExistente,
  validarClienteExiste,
  validarPlatosEnDetalles,
  validarFiltrosPedidos,
  validarCamposActualizables,
};
