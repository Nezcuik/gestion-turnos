const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = require('./config/database');
const bcrypt = require('bcryptjs');

async function crearUsuarioPrueba() {
    const email = 'admin@turnos.com';
    const password = 'AdminTurnos2026!';

    try {
        const [usuarios] = await db.execute(
            'SELECT id_usuario FROM usuario WHERE email = ?',
            [email]
        );

        if (usuarios.length > 0) {
            console.log('El usuario de prueba ya existe.');
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await db.execute(
            `INSERT INTO usuario (email, password_hash, id_rol, activo)
             VALUES (?, ?, ?, ?)`,
            [email, passwordHash, 1, 1]
        );

        console.log('Usuario de prueba creado correctamente.');
        console.log('Email:', email);
        console.log('Contraseña:', password);
    } catch (error) {
        console.error('Error completo:', error);
        console.error('Código:', error?.code);
        console.error('Mensaje SQL:', error?.sqlMessage);
        console.error('Consulta:', error?.sql);
    } finally {
        await db.end();
    }
}

crearUsuarioPrueba();
