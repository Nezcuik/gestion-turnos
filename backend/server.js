const express = require('express');
const path = require('path'); // Agregado
const turnoroutes = require('./routes/turnoroutes');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Agregado
app.use('/api/turnos', turnoroutes);
console.log('Rutas de turnos cargadas correctamente');
app.use('/api/auth', authRoutes);
console.log('Rutas de autenticación cargadas correctamente');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
