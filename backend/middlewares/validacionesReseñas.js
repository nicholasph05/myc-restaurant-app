const { body, validationResult } = require('express-validator');

// Middleware para validar creación de reseña
const validarReseña = [
  body('cliente_id')
    .exists().withMessage('cliente_id es obligatorio')
    .isInt({ min: 1 }).withMessage('cliente_id debe ser un número entero positivo'),

  body('fecha')
    .optional() // opcional porque en el modelo tiene default Date.now
    .isISO8601().withMessage('fecha debe ser una fecha válida'),

  body('tipo_visita')
    .exists().withMessage('tipo_visita es obligatorio')
    .isIn(['Desayuno', 'Almuerzo', 'Cena', 'Evento', 'Otro'])
    .withMessage('tipo_visita debe ser uno de: Desayuno, Almuerzo, Cena, Evento, Otro'),

  body('platos_consumidos')
    .isArray().withMessage('platos_consumidos debe ser un arreglo')
    .custom(arr => arr.every(p => typeof p.id === 'number' && typeof p.nombre === 'string'))
    .withMessage('Cada plato consumido debe tener id (número) y nombre (string)'),

  body('comentario')
    .optional()
    .isString().withMessage('comentario debe ser texto'),

  body('calificacion')
    .exists().withMessage('calificacion es obligatorio')
    .isInt({ min: 1, max: 5 }).withMessage('calificacion debe estar entre 1 y 5'),

  // Middleware para enviar errores si los hay
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {validarReseña};
