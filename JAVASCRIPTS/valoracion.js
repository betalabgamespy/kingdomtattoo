// Estrellas interactivas + botón enviar + localStorage
document.addEventListener('DOMContentLoaded', function() {
    const estrellas = document.querySelectorAll('.estrella');
    let puntuacion = 0;
    
    // Textos para cada puntuación
    const textosPuntuacion = ['', 'Malo', 'Regular', 'Bueno', 'Muy Bueno', 'Excelente'];
    
    // CARGAR COMENTARIOS GUARDADOS AL INICIAR
    cargarComentariosGuardados();
    
    // Configurar estrellas
    estrellas.forEach((estrella, index) => {
        estrella.addEventListener('click', function() {
            puntuacion = index + 1;
            
            // Quitar color a todas
            estrellas.forEach(e => {
                e.style.color = '#d0d0d0';
                e.classList.remove('seleccionada');
            });
            
            // Colorear seleccionadas
            for(let i = 0; i < puntuacion; i++) {
                estrellas[i].style.color = '#222';
                estrellas[i].classList.add('seleccionada');
            }
            
            // Actualizar texto
            document.querySelector('.puntuacion-texto').textContent = textosPuntuacion[puntuacion];
        });
        
        estrella.addEventListener('mouseover', function() {
            for(let i = 0; i <= index; i++) {
                estrellas[i].style.color = '#222';
            }
        });
        
        estrella.addEventListener('mouseout', function() {
            // Solo mantener las seleccionadas
            estrellas.forEach((e, i) => {
                if(!e.classList.contains('seleccionada')) {
                    e.style.color = '#d0d0d0';
                }
            });
        });
    });
    
    // BOTÓN ENVIAR
    const btnEnviar = document.querySelector('.btn-enviar');
    
    if(btnEnviar) {
        btnEnviar.addEventListener('click', function(e) {
            e.preventDefault(); // Evita recargar
            
            const nombre = document.getElementById('nombre').value.trim();
            const comentario = document.getElementById('comentario').value.trim();
            
            // VALIDACIÓN
            if(nombre === '') {
                mostrarMensaje('Escribe tu nombre', 'error');
                document.getElementById('nombre').focus();
                return;
            }
            
            if(puntuacion === 0) {
                mostrarMensaje('Selecciona estrellas', 'error');
                return;
            }
            
            if(comentario === '') {
                mostrarMensaje('Escribe tu comentario', 'error');
                document.getElementById('comentario').focus();
                return;
            }
            
            // CREAR NUEVO COMENTARIO
            const nuevoComentario = {
                nombre: nombre,
                comentario: comentario,
                puntuacion: puntuacion,
                fecha: obtenerFechaActual(),
                timestamp: new Date().getTime() // Para ordenar por fecha
            };
            
            // GUARDAR EN LOCALSTORAGE
            guardarComentario(nuevoComentario);
            
            // AGREGAR A LA LISTA
            agregarComentarioALista(nuevoComentario);
            
            // MOSTRAR MENSAJE DE ÉXITO
            mostrarMensaje('Comentario publicado ✓', 'exito');
            
            // LIMPIAR FORMULARIO
            document.getElementById('nombre').value = '';
            document.getElementById('comentario').value = '';
            puntuacion = 0;
            
            // Resetear estrellas
            estrellas.forEach(e => {
                e.style.color = '#d0d0d0';
                e.classList.remove('seleccionada');
            });
            document.querySelector('.puntuacion-texto').textContent = 'Selecciona estrellas';
        });
    }
    
    // FUNCIÓN PARA GUARDAR COMENTARIO EN LOCALSTORAGE
    function guardarComentario(comentario) {
        // Obtener comentarios existentes
        let comentarios = JSON.parse(localStorage.getItem('comentariosKingdom')) || [];
        
        // Agregar nuevo comentario al inicio
        comentarios.unshift(comentario);
        
        // Mantener solo los últimos 10 comentarios (por si acaso)
        if(comentarios.length > 10) {
            comentarios = comentarios.slice(0, 10);
        }
        
        // Guardar en localStorage
        localStorage.setItem('comentariosKingdom', JSON.stringify(comentarios));
    }
    
    // FUNCIÓN PARA CARGAR COMENTARIOS GUARDADOS
    function cargarComentariosGuardados() {
        const comentarios = JSON.parse(localStorage.getItem('comentariosKingdom')) || [];
        const listaComentarios = document.querySelector('.lista-comentarios');
        
        // Limpiar lista actual
        if(listaComentarios) {
            // Quitar mensaje "sin comentarios" si existe
            const sinComentarios = listaComentarios.querySelector('.sin-comentarios');
            if(sinComentarios) {
                sinComentarios.remove();
            }
            
            // Agregar comentarios guardados (máximo 5)
            const ultimosComentarios = comentarios.slice(0, 5);
            
            ultimosComentarios.forEach(comentario => {
                agregarComentarioALista(comentario, false); // false = sin animación
            });
            
            // Si no hay comentarios, mostrar mensaje
            if(ultimosComentarios.length === 0) {
                listaComentarios.innerHTML = '<p class="sin-comentarios">Sé el primero en comentar...</p>';
            }
        }
    }
    
    // FUNCIÓN PARA AGREGAR COMENTARIO A LA LISTA VISUAL
    function agregarComentarioALista(comentario, animar = true) {
        const listaComentarios = document.querySelector('.lista-comentarios');
        
        if(!listaComentarios) return;
        
        // Quitar mensaje "sin comentarios" si existe
        const sinComentarios = listaComentarios.querySelector('.sin-comentarios');
        if(sinComentarios) {
            sinComentarios.remove();
        }
        
        // Crear elemento HTML del comentario
        const divComentario = document.createElement('div');
        divComentario.className = 'comentario';
        
        const estrellasHTML = '★'.repeat(comentario.puntuacion) + '☆'.repeat(5 - comentario.puntuacion);
        
        divComentario.innerHTML = `
            <div class="comentario-header">
                <span class="nombre-cliente">${comentario.nombre}</span>
                <div class="estrellas-comentario">${estrellasHTML}</div>
            </div>
            <p class="texto-comentario">${comentario.comentario}</p>
            <span class="fecha">${comentario.fecha}</span>
        `;
        
        // Agregar al principio
        listaComentarios.insertBefore(divComentario, listaComentarios.firstChild);
        
        // Animación si se requiere
        if(animar) {
            divComentario.style.opacity = '0';
            divComentario.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                divComentario.style.transition = 'opacity 0.3s, transform 0.3s';
                divComentario.style.opacity = '1';
                divComentario.style.transform = 'translateY(0)';
            }, 10);
        }
        
        // Mantener máximo 5 comentarios visibles
        const todosComentarios = listaComentarios.querySelectorAll('.comentario');
        if(todosComentarios.length > 5) {
            todosComentarios[5].remove();
        }
    }
    
    // FUNCIÓN PARA OBTENER FECHA ACTUAL
    function obtenerFechaActual() {
        const ahora = new Date();
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const diferencia = ahora - hoy;
        const unDia = 24 * 60 * 60 * 1000;
        
        if(diferencia < unDia) {
            // Hoy
            const horas = ahora.getHours().toString().padStart(2, '0');
            const minutos = ahora.getMinutes().toString().padStart(2, '0');
            return `Hoy ${horas}:${minutos}`;
        } else if(diferencia < 2 * unDia) {
            // Ayer
            const horas = ahora.getHours().toString().padStart(2, '0');
            const minutos = ahora.getMinutes().toString().padStart(2, '0');
            return `Ayer ${horas}:${minutos}`;
        } else {
            // Hace X días
            const dias = Math.floor(diferencia / unDia);
            return `Hace ${dias} días`;
        }
    }
    
    // FUNCIÓN PARA MOSTRAR MENSAJES
    function mostrarMensaje(texto, tipo) {
        const mensajeAnterior = document.querySelector('.mensaje-flotante');
        if(mensajeAnterior) {
            mensajeAnterior.remove();
        }
        
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-flotante';
        mensaje.textContent = texto;
        
        mensaje.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 400;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        
        if(tipo === 'error') {
            mensaje.style.background = '#fff0f0';
            mensaje.style.color = '#d32f2f';
            mensaje.style.border = '1px solid #ffcdd2';
        } else {
            mensaje.style.background = '#f0fff0';
            mensaje.style.color = '#2e7d32';
            mensaje.style.border = '1px solid #c8e6c9';
        }
        
        document.body.appendChild(mensaje);
        
        setTimeout(() => {
            mensaje.style.opacity = '1';
            mensaje.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        setTimeout(() => {
            mensaje.style.opacity = '0';
            mensaje.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if(mensaje.parentNode) {
                    mensaje.parentNode.removeChild(mensaje);
                }
            }, 300);
        }, 3000);
    }
});