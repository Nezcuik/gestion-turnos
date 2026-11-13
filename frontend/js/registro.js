const form = document.getElementById('formRegistro');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    resultado.textContent = 'Registrando...';
    resultado.style.color = '#333';

    const datos = {
        dni_paciente: Number(document.getElementById('dni_paciente').value),
        nombre_paciente: document.getElementById('nombre_paciente').value,
        apellido_paciente: document.getElementById('apellido_paciente').value,
        fec_nac_paciente: document.getElementById('fec_nac_paciente').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const respuesta = await fetch('/api/auth/registro-paciente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const json = await respuesta.json();

        if (respuesta.ok) {
            // Si el backend nos manda el token de desarrollo, armamos el botón directo
            if (json.tokenDev) {
                const urlVerificacion = `verificar-email.html?token=${json.tokenDev}`;
                
                // Reemplazamos el contenido de la tarjeta con un botón de acceso directo
                const card = document.querySelector('.card');
                card.innerHTML = `
                    <div style="text-align: center;">
                        <h2 style="color: #28a745;">¡Registro Exitoso! ✉️</h2>
                        <p style="color: #555; margin: 15px 0;">${json.mensaje}</p>
                        <p style="color: #666; font-size: 0.85rem; margin-bottom: 20px;">
                            Modo de pruebas activo: Haz clic abajo para verificar sin buscar en Ethereal.
                        </p>
                        <a href="${urlVerificacion}" style="display: inline-block; background: #007bff; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">
                            ⚡ Verificar cuenta automáticamente
                        </a>
                    </div>
                `;
            } else {
                // Si por algo no viene, redirige al aviso normal
                window.location.href = 'verificar-aviso.html';
            }
        } else {
            resultado.style.color = 'red';
            resultado.textContent = json.error || 'Ocurrió un error en el registro.';
        }
    } catch (error) {
        resultado.style.color = 'red';
        resultado.textContent = 'Error de conexión con el servidor.';
    }
});