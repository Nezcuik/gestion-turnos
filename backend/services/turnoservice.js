const db = require('../config/database');

async function obtenerTodos() {
    const [turnos] = await db.query(`
        SELECT *
        FROM turno
        ORDER BY fecha_turno, hora_turno
    `);
    return turnos;
}

module.exports = {
    obtenerTodos
};