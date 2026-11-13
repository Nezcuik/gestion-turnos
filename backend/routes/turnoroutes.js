const express = require('express');
const router = express.Router();
const turnocontroller = require('../controllers/turnocontroller');
const validarCreacionTurno = require('../validators/turnoValidator');
const verificarToken = require('../middlewares/authMiddleware');
const autorizarRol = require('../middlewares/autorizarRol');

// Todas las rutas de turnos requieren un token válido

// 1. Verificar que el usuario tenga un token válido
router.use(verificarToken);

// 2. Permitir solamente al ADMIN
router.use(autorizarRol(1));

// 3. Rutas CRUD de turnos
router.get('/', turnocontroller.obtenerTurnos);
router.get('/:id', turnocontroller.obtenerTurnoPorId);
router.post('/', validarCreacionTurno, turnocontroller.crearTurno);
router.put('/:id', turnocontroller.actualizarTurno);
router.delete('/:id', turnocontroller.eliminarTurno);

module.exports = router;
