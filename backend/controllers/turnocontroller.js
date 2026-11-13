const db = require('../config/database');
const turnoservice = require('../services/turnoservice');


// OBTENER TODOS LOS TURNOS (CON FILTROS OPCIONALES)

async function obtenerTurnos(req, res) {
    try {
        const { dni, estado } = req.query;
        let query = 'SELECT * FROM turno WHERE 1=1';
        const params = [];

        if (dni && dni.trim() !== '') {
            query += ' AND dni_paciente = ?';
            params.push(dni.trim());
        }

        if (estado && estado !== 'Todos') {
            query += ' AND estado_turno = ?';
            params.push(estado);
        }

        query += ' ORDER BY id_turno DESC';

        const [turnos] = await db.query(query, params);
        res.json(turnos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener los turnos'
        });
    }
}


// OBTENER TURNOS POR ID


async function obtenerTurnoPorId(req, res) {
    try {
        const id = req.params.id;
        const [turnos] = await db.execute(
            'SELECT * FROM turno WHERE id_turno = ?',
            [id]
        );
        if (turnos.length === 0) {
            return res.status(404).json({
                error: 'Turno no encontrado'
            });
        }
        res.json(turnos[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al obtener el turno'
        });
    }
}


// CREAR TURNO


async function crearTurno(req, res) {
    try {
        const {
            fecha_turno,
            hora_turno,
            medio_solicitado,
            estado_turno,
            fecha_confirmacion,
            medico_confirmacion,
            dni_paciente,
            id_practica,
            id_equipo,
            id_disponibilidad
        } = req.body;

        const [resultado] = await db.query(
            `INSERT INTO turno (
                fecha_turno,
                hora_turno,
                medio_solicitado,
                estado_turno,
                fecha_confirmacion,
                medico_confirmacion,
                dni_paciente,
                id_practica,
                id_equipo,
                id_disponibilidad
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fecha_turno,
                hora_turno,
                medio_solicitado,
                estado_turno,
                fecha_confirmacion || null,
                medico_confirmacion || null,
                dni_paciente,
                id_practica,
                id_equipo,
                id_disponibilidad
            ]
        );

        res.status(201).json({
            mensaje: 'Turno creado correctamente',
            id_turno: resultado.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al crear el turno'
        });
    }
}


// ACTUALIZAR TURNO


async function actualizarTurno(req, res) {
    try {
        const id = req.params.id;
        const {
            fecha_turno,
            hora_turno,
            medio_solicitado,
            estado_turno,
            fecha_confirmacion,
            medico_confirmacion,
            dni_paciente,
            id_practica,
            id_equipo,
            id_disponibilidad
        } = req.body;

        const [turnos] = await db.execute(
            'SELECT id_turno FROM turno WHERE id_turno = ?',
            [id]
        );

        if (turnos.length === 0) {
            return res.status(404).json({
                error: 'Turno no encontrado'
            });
        }

        await db.execute(
            `UPDATE turno
             SET fecha_turno = ?,
                 hora_turno = ?,
                 medio_solicitado = ?,
                 estado_turno = ?,
                 fecha_confirmacion = ?,
                 medico_confirmacion = ?,
                 dni_paciente = ?,
                 id_practica = ?,
                 id_equipo = ?,
                 id_disponibilidad = ?
             WHERE id_turno = ?`,
            [
                fecha_turno,
                hora_turno,
                medio_solicitado,
                estado_turno,
                fecha_confirmacion || null,
                medico_confirmacion || null,
                dni_paciente,
                id_practica,
                id_equipo,
                id_disponibilidad,
                id
            ]
        );

        res.json({
            mensaje: 'Turno actualizado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al actualizar el turno'
        });
    }
}


// ELIMINAR TURNO


async function eliminarTurno(req, res) {
    try {
        const id = req.params.id;

        const [resultado] = await db.execute(
            'DELETE FROM turno WHERE id_turno = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: 'Turno no encontrado'
            });
        }

        res.json({
            mensaje: 'Turno eliminado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al eliminar el turno'
        });
    }
}


// EXPORTAR CONTROLADORES


module.exports = {
    obtenerTurnos,
    obtenerTurnoPorId,
    crearTurno,
    actualizarTurno,
    eliminarTurno,
};