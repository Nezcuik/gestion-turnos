// validators/turnoValidator.js
const db = require('../config/database');

function fechaValida(fecha) {
    if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return false;
    }

    const fechaParseada = new Date(`${fecha}T00:00:00Z`);
    return !Number.isNaN(fechaParseada.getTime()) &&
        fechaParseada.toISOString().slice(0, 10) === fecha;
}

function horaValida(hora) {
    return typeof hora === 'string' &&
        /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(hora);
}

async function validarCreacionTurno(req, res, next) {
    try {
        const datos = req.body || {};
        const errores = [];

        // Campos obligatorios
        for (const campo of [
            'fecha_turno',
            'hora_turno',
            'medio_solicitado',
            'estado_turno',
            'dni_paciente'
        ]) {
            if (
                datos[campo] === undefined ||
                datos[campo] === null ||
                String(datos[campo]).trim() === ''
            ) {
                errores.push(`El campo ${campo} es obligatorio`);
            }
        }

        for (const campo of ['id_practica', 'id_equipo', 'id_disponibilidad']) {
            const valor = Number(datos[campo]);

            if (
                datos[campo] === undefined ||
                datos[campo] === null ||
                datos[campo] === '' ||
                !Number.isInteger(valor) ||
                valor <= 0
            ) {
                errores.push(`${campo} debe ser un número entero positivo`);
            }
        }

        if (datos.fecha_turno && !fechaValida(datos.fecha_turno)) {
            errores.push('fecha_turno debe tener el formato YYYY-MM-DD y ser una fecha válida');
        }

        if (datos.hora_turno && !horaValida(datos.hora_turno)) {
            errores.push('hora_turno debe tener el formato HH:mm o HH:mm:ss');
        }

        if (
            datos.fecha_confirmacion &&
            !fechaValida(datos.fecha_confirmacion)
        ) {
            errores.push('fecha_confirmacion debe tener el formato YYYY-MM-DD');
        }

        const [pacientes] = await db.execute(
            'SELECT 1 FROM paciente WHERE dni_paciente = ? LIMIT 1',
            [datos.dni_paciente]
        );
        if (pacientes.length === 0) {
            errores.push('El paciente no existe');
        }

        const [practicas] = await db.execute(
            'SELECT 1 FROM practica WHERE id_practica = ? LIMIT 1',
            [datos.id_practica]
        );
        if (practicas.length === 0) {
            errores.push('La práctica no existe');
        }

        const [equipos] = await db.execute(
            'SELECT 1 FROM equipo WHERE id_equipo = ? LIMIT 1',
            [datos.id_equipo]
        );
        if (equipos.length === 0) {
            errores.push('El equipo no existe');
        }

        const [disponibilidades] = await db.execute(
            'SELECT 1 FROM disponibilidad WHERE id_disponibilidad = ? LIMIT 1',
            [datos.id_disponibilidad]
        );
        if (disponibilidades.length === 0) {
            errores.push('La disponibilidad no existe');
        }

        // validaciones agregadas hoy
        // ---------------------------------------------------------------------------------------------
        // Verificar que la fecha sea despues no antes del dias de la creacion del turno
        const hoy = new Date().toISOString().slice(0, 10);
        if (datos.fecha_turno && datos.fecha_turno < hoy) {
            errores.push('No se pueden asignar turnos en fechas anteriores a la actual');
        }

        // Verifica q el paciente no tenga otro turno con la misma fecha y hora
        const [turnoPaciente] = await db.execute(
            'SELECT 1 FROM turno WHERE dni_paciente = ? AND DATE(fecha_turno) = ? AND TIME(hora_turno) = ? LIMIT 1',
            [datos.dni_paciente, datos.fecha_turno, datos.hora_turno]
        );

        if (turnoPaciente.length > 0) {
            errores.push('El paciente ya tiene un turno registrado en esa misma fecha y hora');
        }
        // ---------------------------------------------------------------------------------------------
        
        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error al validar los datos del turno'
        });
    }
}

module.exports = validarCreacionTurno;