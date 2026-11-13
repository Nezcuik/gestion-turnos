# Trabajo Practico - Gestión de turnos 

El centro se encuentra organizado en servicios médicos, como Radiología, Tomografía y Ecografía. Cada práctica médica pertenece a un único servicio y tiene una duración determinada. Un servicio puede ofrecer diferentes prácticas.

Cada servicio dispone de uno o más equipos. Cada equipo pertenece exclusivamente a un servicio, aunque puede utilizarse para realizar diferentes prácticas de ese servicio. Una práctica puede ser realizada en cualquiera de los equipos compatibles, pero, al reservar un turno, debe asignarse un único equipo específico.

El centro atiende de lunes a viernes de 8:00 a 20:00 y los sábados de 8:00 a 14:00. Los domingos permanece cerrado.

Cada médico trabaja para un único servicio, aunque puede realizar una o varias de las prácticas correspondientes a ese servicio. Asimismo, una misma práctica puede ser realizada por diferentes médicos.

Los médicos no concurren todos los días ni durante todo el horario de atención. Por este motivo, se deben registrar los días de la semana y las franjas horarias en las que cada médico se encuentra disponible. Un médico puede tener más de una franja horaria de disponibilidad para un mismo día.

Dentro de cada servicio puede haber médicos que cumplan la función de supervisar a otros profesionales. Un médico puede supervisar a ninguno, uno o varios médicos, mientras que cada médico puede ser supervisado por, como máximo, otro médico. Tanto el médico supervisor como los médicos supervisados deben pertenecer al mismo servicio. Un médico no puede supervisarse a sí mismo.

Al momento de asignar un turno existen ciertas condiciones que deben cumplirse. Se pide identificar cuáles son estas condiciones y explicar cómo se garantizarían desde el diseño de la base de datos:

* la fecha y la hora se encuentren dentro del horario de atención del centro;  
* el médico esté disponible;  
* el médico pueda realizar la práctica solicitada;  
* el equipo sea compatible con la práctica;  
* ni el médico ni el equipo tengan otro turno asignado durante ese horario.

De cada paciente se registran su DNI, nombre, apellido, fecha de nacimiento, teléfono y correo electrónico. Un paciente puede no tener obra social o estar afiliado a una única obra social. En este último caso, también se registra su número de afiliado.

El centro trabaja con diferentes obras sociales. Cada obra social puede cubrir determinadas prácticas y una misma práctica puede estar cubierta por distintas obras sociales.

Los pacientes pueden solicitar un turno por teléfono o por correo electrónico. Cada turno corresponde a un único paciente, una práctica, un médico, un equipo, una fecha y una hora. También se debe registrar el medio por el cual fue solicitado.

Los turnos pueden encontrarse únicamente en uno de los siguientes estados:

* **Reservado:** el turno fue registrado, pero todavía no fue confirmado por el paciente.  
* **Confirmado:** el paciente confirmó que asistirá.  
* **Cancelado:** el turno fue cancelado y el horario vuelve a estar disponible.

Con anterioridad a la fecha del turno, el centro se comunica con el paciente por teléfono o por correo electrónico para confirmar su asistencia. Se registra la fecha y el medio utilizado para la confirmación. Si no se logra contactar al paciente, el turno continúa en estado reservado.

El paciente puede solicitar la modificación de la fecha o la hora de un turno reservado o confirmado. La modificación se realiza sobre el mismo turno y no es necesario conservar el historial de valores anteriores. Si se modifica un turno confirmado, este vuelve al estado reservado y debe ser confirmado nuevamente.

Cuando el paciente se presenta en el centro, el personal de recepción busca el turno y verifica que los datos personales estén completos. Si falta algún dato, se actualiza la información del paciente. No es necesario registrar qué empleado creó o modificó el turno.

El alcance de la herramienta finaliza en la administración y confirmación de los turnos. No se registran diagnósticos, resultados médicos ni la realización efectiva de la práctica.