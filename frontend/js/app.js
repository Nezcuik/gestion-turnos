// Esperar a que todo el HTML esté cargado antes de buscar elementos
document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formLogin');
    const mensaje = document.getElementById('mensaje');
    
    // Verificación de seguridad por si no encuentra el form
    if (!formulario) {
        console.error('No se encontró el formulario de login en el DOM');
        return;
    }

    const boton = formulario.querySelector('button');

    formulario.addEventListener('submit', async function (evento) {
        evento.preventDefault(); // <-- Ahora sí frena la recarga por HTML
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        mensaje.textContent = '';
        boton.disabled = true;
        boton.textContent = 'Ingresando...';

        try {
            const datos = await iniciarSesion(email, password);

            // Guardar el token y los datos
            sessionStorage.setItem('token', datos.token);
            sessionStorage.setItem('usuario', JSON.stringify(datos.usuario));

            mensaje.textContent = `Bienvenida/o, ${datos.usuario.email}. Redirigiendo...`;
            mensaje.style.color = 'green';

            console.log('Login exitoso, redirigiendo a dashboard...');

            // Redirigir al panel
            window.location.href = '/pages/dashboard.html';

        } catch (error) {
            mensaje.textContent = error.message;
            mensaje.style.color = 'red';
        } finally {
            boton.disabled = false;
            boton.textContent = 'Iniciar sesión';
        }
    });
});