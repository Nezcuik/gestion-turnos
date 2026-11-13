const express = require('express');
const router = express.Router();

// Importar los controladores necesarios
const authController = require('../controllers/authController');
const registroController = require('../controllers/registrocontrollers');
const verificacionController = require('../controllers/verificacionController');

// Rutas existentes de login y registro...
router.post('/login', authController.login);
router.post('/registro-paciente', registroController.registrarPaciente);
router.post('/registro-medico', registroController.registrarMedico);

// NUEVA RUTA: Endpoint para verificar el correo electrónico con el token
router.get('/verificar-email', verificacionController.verificarEmail);

module.exports = router;