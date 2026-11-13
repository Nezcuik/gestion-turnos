function autorizarRol(...rolesPermitidos) {
    return function (req, res, next) {
        // Verificar que el middleware de autenticación haya identificado al usuario
        if (!req.usuario) {
            return res.status(401).json({
                error: 'Se requiere autenticación'
            });
        }

        const idRol = Number(req.usuario.id_rol);

        // Comprobar si el rol del usuario está permitido
        if (!rolesPermitidos.includes(idRol)) {
            return res.status(403).json({
                error: 'No tenés permisos para realizar esta acción'
            });
        }

        next();
    };
}

module.exports = autorizarRol;