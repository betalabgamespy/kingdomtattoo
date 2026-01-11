// Estrellas interactivas + botón enviar + límite de 5 comentarios
document.addEventListener('DOMContentLoaded', function() {
    const estrellas = document.querySelectorAll('.estrella');
    let puntuacion = 0;
    
    // Textos para cada puntuación
    const textosPuntuacion = ['', 'Malo', 'Regular', 'Bueno', 'Muy Bueno', 'Excelente'];
    
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
            const nuevoComentario = document.createElement('div');
            nuevoComentario.className = 'comentario';
            nuevoComentario.innerHTML = `
                <div class="comentario-header">
                    <span class="nombre-cliente">${nombre}</span>
                    <div class="estrellas-comentario">${'★'.repeat(puntuacion)}${'☆'.repeat(5-puntuacion)}</div>
                </div>
                <p class="texto-comentario">${comentario}</p>
                <span class="fecha">${obtenerFechaActual()}</span>
            `;
            
            // Añadir animación
            nuevoComentario.style.opacity = '0';
            nuevoComentario.style.transform = 'translateY(10px)';
            
            // Añadir al principio y LIMITAR A 5
            const listaComentarios = document.querySelector('.lista-comentarios');
            if(listaComentarios) {
                // Añadir nuevo comentario al principio
                listaComentarios.insertBefore(nuevoComentario, listaComentarios.firstChild);
                
                // Mantener solo los primeros 5 comentarios
                const todosComentarios = listaComentarios.querySelectorAll('.comentario');
                if(todosComentarios.length > 5) {
                    // Eliminar el comentario más antiguo (el último)
                    todosComentarios[5].remove();
                }
                
                // Animar entrada
                setTimeout(() => {
                    nuevoComentario.style.transition = 'opacity 0.3s, transform 0.3s';
                    nuevoComentario.style.opacity = '1';
                    nuevoComentario.style.transform = 'translateY(0)';
                }, 10);
            }
            
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
    
    // FUNCIÓN PARA OBTENER FECHA ACTUAL
    function obtenerFechaActual() {
        const ahora = new Date();
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        return `Hoy ${horas}:${minutos}`;
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