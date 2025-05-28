// Función para detectar si la pantalla está en modo móvil basado en el ancho
function isMobileDevice() {
    return window.innerWidth <= 768; // Considera pantallas menores o iguales a 768px como móviles
}

// Selecciona todos los small-circle
const smallCircles = document.querySelectorAll('.small-circle');
let hoverTimeout; // Variable para controlar el tiempo del hover

// Selecciona el header, footer y la sección del disco
const header = document.getElementById('mainHeader');
const footer = document.getElementById('mainFooter');
const mainDiscSection = document.querySelector('.content-section');

// Botón flotante para regresar al disco
const backToDiscButton = document.getElementById('backToDisc');

// Función para mostrar el botón cuando no se está en el disco
function toggleBackToDiscButton() {
    const discPosition = mainDiscSection.getBoundingClientRect().bottom;
    if (discPosition < 0) {
        backToDiscButton.classList.add('show');
    } else {
        backToDiscButton.classList.remove('show');
    }
}

// Controla el botón flotante en scroll y resize
window.addEventListener('scroll', toggleBackToDiscButton);
window.addEventListener('resize', toggleBackToDiscButton);

// Función para desplazamiento suave con duración personalizada
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animationScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animationScroll);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animationScroll);
}

// Desplazamiento suave al disco principal y reinicia el resplandor
backToDiscButton.addEventListener('click', () => {
    smoothScrollTo(mainDiscSection.offsetTop, 800); // Ajusta la duración aquí

    // Reinicia la animación del resplandor del header
    resetGlowAnimation();
});

// Función para reiniciar la animación del resplandor del header
function resetGlowAnimation() {
    // Crea una animación temporal para reiniciar el efecto del header
    header.style.setProperty('--glow-reset', 'none');
    setTimeout(() => {
        header.style.removeProperty('--glow-reset');
    }, 50); // Espera breve para permitir el reinicio de la animación
}

// Función para mostrar u ocultar el header y footer basado en la posición del disco
function toggleHeaderFooter() {
    const discTop = mainDiscSection.getBoundingClientRect().top;
    const discBottom = mainDiscSection.getBoundingClientRect().bottom;

    // Mostrar el header y footer solo cuando el disco esté visible
    if (discTop <= window.innerHeight && discBottom >= 0) {
        header.classList.add('show');
        footer.classList.add('show');
    } else {
        header.classList.remove('show');
        footer.classList.remove('show');
    }
}

// Ejecutar la función al cargar la página y ajustar la visibilidad del header y footer
window.addEventListener('load', () => {
    toggleHeaderFooter();
    toggleBackToDiscButton(); // Asegura que el botón se actualice al cargar la página
});

// Aseguramos que las funciones se ejecuten correctamente tanto en scroll como en resize
['scroll', 'resize', 'orientationchange', 'touchmove'].forEach(event => {
    window.addEventListener(event, () => {
        toggleHeaderFooter();
        toggleBackToDiscButton();
    });
});

// Manejo de eventos para los small-circles
smallCircles.forEach((circle, index) => {
    let isHoverActive = false; // Controla si el hover está activo

    // Lógica específica para dispositivos móviles
    if (isMobileDevice()) {
        circle.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita propagación de clics no deseados

            // Si el hover está activo, el segundo clic lleva a la sección correspondiente
            if (isHoverActive) {
                const targetSection = document.getElementById(`sec${index + 1}`);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    isHoverActive = false; // Resetea el estado después de redirigir
                }
            } else {
                // Si el hover no está activo, muestra el summary y activa el hover
                clearTimeout(hoverTimeout);
                circle.classList.add('active-hover');
                isHoverActive = true;

                // Desactiva el hover automáticamente después de 3 segundos
                hoverTimeout = setTimeout(() => {
                    circle.classList.remove('active-hover');
                    isHoverActive = false;
                }, 3000);
            }
        });

        // Desactivar el hover al tocar fuera del círculo
        document.addEventListener('click', (e) => {
            if (!circle.contains(e.target)) {
                circle.classList.remove('active-hover');
                isHoverActive = false;
            }
        });
    } else {
        // Lógica estándar de escritorio: hover y clic normal
        circle.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            circle.classList.add('active-hover');

            hoverTimeout = setTimeout(() => {
                circle.classList.remove('active-hover');
            }, 2000); // 2 segundos
        });

        circle.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            circle.classList.remove('active-hover');
        });

        // Clic para redirigir a la sección correspondiente en escritorio
        circle.addEventListener('click', () => {
            const targetSection = document.getElementById(`sec${index + 1}`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
