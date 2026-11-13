-- 1. Agregar campo de verificación a la tabla existente
ALTER TABLE usuario
ADD COLUMN email_verificado TINYINT(1) NOT NULL DEFAULT 0;

-- 2. Marcar tu usuario admin de prueba como verificado
UPDATE usuario
SET email_verificado = 1
WHERE email = 'admin@turnos.com';

-- 3. Crear la tabla para los tokens de verificación y recuperación
CREATE TABLE token_cuenta (
    id_token INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    token_hash CHAR(64) NOT NULL UNIQUE,
    tipo ENUM(
        'VERIFICACION_EMAIL',
        'RECUPERACION_PASSWORD'
    ) NOT NULL,
    fecha_expiracion DATETIME NOT NULL,
    usado TINYINT(1) NOT NULL DEFAULT 0,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_token_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);