// frontend/js/dashboard.js
document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');

    // 1. Validar autenticación por JWT
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    // 2. Mostrar datos del usuario en sesión
    const datosUsuario = document.getElementById('datosUsuario');
    const usuarioGuardado = sessionStorage.getItem('usuario');

    if (usuarioGuardado) {
        try {
            const usuario = JSON.parse(usuarioGuardado);
            datosUsuario.textContent = `Sesión iniciada: ${usuario.email} (Rol ID: ${usuario.id_rol})`;
        } catch (e) {
            datosUsuario.textContent = 'Sesión iniciada correctamente';
        }
    }

    // 3. Botón Cerrar Sesión
    const botonCerrarSesion = document.getElementById('cerrarSesion');
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener('click', function () {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('usuario');
            window.location.href = '../index.html';
        });
    }

    // 4. Cargar Turnos al iniciar la vista
    cargarTurnos();

    // 5. Manejar el formulario de creación de turnos (POST)
    const formCrearTurno = document.getElementById('formCrearTurno');
    const mensajeTurno = document.getElementById('mensajeTurno');

    if (formCrearTurno) {
        formCrearTurno.addEventListener('submit', async function (e) {
            e.preventDefault();
            mensajeTurno.textContent = 'Guardando turno...';
            mensajeTurno.style.color = '#333';

            const nuevoTurno = {
                fecha_turno: document.getElementById('fecha_turno').value,
                hora_turno: document.getElementById('hora_turno').value + ':00', // Formato HH:mm:ss para MySQL
                medio_solicitado: document.getElementById('medio_solicitado').value,
                estado_turno: document.getElementById('estado_turno').value,
                dni_paciente: Number(document.getElementById('dni_paciente').value),
                id_practica: Number(document.getElementById('id_practica').value),
                id_equipo: Number(document.getElementById('id_equipo').value),
                id_disponibilidad: Number(document.getElementById('id_disponibilidad').value)
            };

            try {
                const respuesta = await fetch('/api/turnos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(nuevoTurno)
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    mensajeTurno.style.color = 'green';
                    mensajeTurno.textContent = '¡Turno creado con éxito!';
                    formCrearTurno.reset();
                    cargarTurnos(); // Actualizar la tabla dinámicamente
                } else {
                    mensajeTurno.style.color = 'red';
                    // Si el validador devuelve errores en un array o un error único
                    if (Array.isArray(resultado.errores)) {
                        mensajeTurno.textContent = resultado.errores.join(' | ');
                    } else {
                        mensajeTurno.textContent = resultado.error || 'Error al crear el turno';
                    }
                }
            } catch (error) {
                console.error('Error de red:', error);
                mensajeTurno.style.color = 'red';
                mensajeTurno.textContent = 'Error de conexión con el servidor.';
            }
        });
    }
});

// Función para obtener y listar los turnos desde la API REST (GET)
async function cargarTurnos() {
    const token = sessionStorage.getItem('token');
    const tbody = document.querySelector('#tablaTurnos tbody');

    if (!tbody) return;

    try {
        const respuesta = await fetch('/api/turnos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (respuesta.status === 401 || respuesta.status === 403) {
            alert('Sesión expirada o sin permisos de administrador.');
            sessionStorage.clear();
            window.location.href = '../index.html';
            return;
        }

        const turnos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(turnos.error || 'No se pudieron cargar los turnos');
        }

        tbody.innerHTML = '';

        if (turnos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 20px;">No hay turnos registrados.</td></tr>`;
            return;
        }

        turnos.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${t.id_turno}</td>
                <td>${t.fecha_turno ? t.fecha_turno.split('T')[0] : ''}</td>
                <td>${t.hora_turno || ''}</td>
                <td><strong>${t.estado_turno}</strong></td>
                <td>${t.medio_solicitado}</td>
                <td>${t.dni_paciente}</td>
                <td>${t.id_practica}</td>
                <td>${t.id_equipo}</td>
                <td>${t.id_disponibilidad}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarTurno(${t.id_turno})">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error al cargar turnos:', error);
        tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: red; padding: 20px;">Error al cargar los datos del servidor.</td></tr>`;
    }
}

// Función global para eliminar un turno (DELETE)
async function eliminarTurno(id) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el turno ID ${id}?`)) {
        return;
    }

    const token = sessionStorage.getItem('token');

    try {
        const respuesta = await fetch(`/api/turnos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert('Turno eliminado correctamente');
            cargarTurnos(); // Recargar la tabla
        } else {
            alert(resultado.error || 'No se pudo eliminar el turno');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error de conexión con el servidor.');
    }
}