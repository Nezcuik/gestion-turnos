const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function verificarCredenciales(email, password) {
    const [usuarios] = await db.execute(
        `SELECT id_usuario, email, password_hash, id_rol, activo, email_verificado
         FROM usuario
         WHERE email = ?`,
        [email]
    );

    // Verificar que el usuario exista y esté activo
    if (usuarios.length === 0 || usuarios[0].activo !== 1) {
        return null;
    }

    const usuario = usuarios[0];

    // Verificar si el correo ya fue verificado
    if (usuario.email_verificado !== 1) {
        return { error: 'EMAIL_NO_VERIFICADO' };
    }

    // Comparar la contraseña ingresada con el hash guardado
    const passwordValida = await bcrypt.compare(
        password,
        usuario.password_hash
    );

    if (!passwordValida) {
        return null;
    }

    // Devolver solamente los datos necesarios para el token y sesión
    return {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        id_rol: usuario.id_rol
    };
}

module.exports = {
    verificarCredenciales
};