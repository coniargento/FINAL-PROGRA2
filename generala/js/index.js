// Variables del juego
let dados = [1, 1, 1, 1, 1];
let dadosBloqueados = [false, false, false, false, false];
let tiroActual = 1;
let jugadorActual = 0;
let puntuaciones = {
    p1: {
        as: null, doses: null, treses: null, cuatros: null, cincos: null, seis: null,
        poker: null, full: null, escalera: null, generala: null, dobleGenerala: null,
        total: 0
    },
    p2: {
        as: null, doses: null, treses: null, cuatros: null, cincos: null, seis: null,
        poker: null, full: null, escalera: null, generala: null, dobleGenerala: null,
        total: 0
    }
};

// Inicializar el juego
document.addEventListener('DOMContentLoaded', function() {
    cargarPerfiles();
    inicializarJuego();
});

function cargarPerfiles() {
    const perfiles = Storage.cargar("perfiles");
    if (perfiles && perfiles.length >= 2) {
        document.getElementById('jugador1-nombre').textContent = perfiles[0].nombre;
        document.getElementById('jugador2-nombre').textContent = perfiles[1].nombre;
    }
}

function inicializarJuego() {
    tiroActual = 1;
    ocultarDados();
    actualizarControles();
    actualizarTurnoVisual();
    actualizarTablero();
}

// Tirar dados
function tirarDados() {
    if (tiroActual > 3) return;
    
    // Generar nuevos valores para los dados
    for (let i = 0; i < 5; i++) {
        if (!dadosBloqueados[i]) {
            dados[i] = Math.floor(Math.random() * 6) + 1;
        }
    }
    
    // Mostrar dados con animación
    mostrarDadosConAnimacion();
    
    tiroActual++;
    actualizarControles();
}

// Mostrar dados con animación
function mostrarDadosConAnimacion() {
    const dadosElements = document.querySelectorAll('.dice');
    
    dadosElements.forEach((dado, index) => {
        // Remover clases anteriores
        dado.classList.remove('visible', 'bloqueado');
        
        // Actualizar el número del dado
        dado.textContent = dados[index];
        
        // Aplicar clase de bloqueado si corresponde
        if (dadosBloqueados[index]) {
            dado.classList.add('bloqueado');
        }
        
        // Mostrar con animación con delay escalonado
        setTimeout(() => {
            dado.classList.add('visible');
        }, index * 150); // Cada dado aparece 150ms después que el anterior
    });
    
    // Actualizar el contador de tiros
    document.getElementById('tiro-actual').textContent = tiroActual;
}

// Actualizar visualización de dados
function actualizarDados() {
    for (let i = 0; i < 5; i++) {
        const dado = document.getElementById(`dado${i + 1}`);
        dado.textContent = dados[i];
        dado.className = dadosBloqueados[i] ? 'dice bloqueado' : 'dice';
    }
    document.getElementById('tiro-actual').textContent = tiroActual;
}

// Bloquear/desbloquear dado
function toggleDado(index) {
    if (tiroActual > 1) {
        dadosBloqueados[index] = !dadosBloqueados[index];
        
        const dado = document.getElementById(`dado${index + 1}`);
        dado.classList.remove('bloqueado');
        
        if (dadosBloqueados[index]) {
            dado.classList.add('bloqueado');
        }
    }
}

// Actualizar controles
function actualizarControles() {
    const btnTirar = document.getElementById('btn-tirar');
    
    if (tiroActual > 3) {
        btnTirar.disabled = true;
    } else {
        btnTirar.disabled = false;
    }
}

// Calcular puntuación para una categoría
function calcularPuntuacion(categoria) {
    const conteo = contarDados();
    
    switch (categoria) {
        case 'as': return conteo[1] * 1;
        case 'doses': return conteo[2] * 2;
        case 'treses': return conteo[3] * 3;
        case 'cuatros': return conteo[4] * 4;
        case 'cincos': return conteo[5] * 5;
        case 'seis': return conteo[6] * 6;
        case 'poker': return esPoker(conteo) ? 40 : 0;
        case 'full': return esFull(conteo) ? 30 : 0;
        case 'escalera': return esEscalera(conteo) ? 20 : 0;
        case 'generala': return esGenerala(conteo) ? 50 : 0;
        case 'dobleGenerala': return esDobleGenerala(conteo) ? 100 : 0;
        default: return 0;
    }
}

// Contar frecuencia de cada dado
function contarDados() {
    const conteo = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
    dados.forEach(dado => conteo[dado]++);
    return conteo;
}

// Verificar combinaciones
function esPoker(conteo) {
    return Object.values(conteo).some(count => count >= 4);
}

function esFull(conteo) {
    const valores = Object.values(conteo);
    return valores.includes(3) && valores.includes(2);
}

function esEscalera(conteo) {
    const valores = Object.values(conteo);
    return (valores[0] >= 1 && valores[1] >= 1 && valores[2] >= 1 && valores[3] >= 1 && valores[4] >= 1) ||
           (valores[1] >= 1 && valores[2] >= 1 && valores[3] >= 1 && valores[4] >= 1 && valores[5] >= 1);
}

function esGenerala(conteo) {
    return Object.values(conteo).some(count => count === 5);
}

function esDobleGenerala(conteo) {
    return Object.values(conteo).some(count => count === 5);
}

// Seleccionar categoría para anotar
function seleccionarCategoria(categoria, jugador) {
    if (jugador !== jugadorActual || tiroActual <= 1) return;
    
    const jugadorKey = jugador === 0 ? 'p1' : 'p2';
    const puntuacion = calcularPuntuacion(categoria);
    
    // Anotar puntuación
    puntuaciones[jugadorKey][categoria] = puntuacion;
    
    // Actualizar tablero
    actualizarTablero();
    
    // Cambiar turno
    cambiarTurno();
}

// Anotar puntuación (función alternativa)
function anotarPuntuacion() {
    // Mostrar opciones disponibles
    const jugadorKey = jugadorActual === 0 ? 'p1' : 'p2';
    const categoriasDisponibles = [];
    
    Object.keys(puntuaciones[jugadorKey]).forEach(cat => {
        if (cat !== 'total' && puntuaciones[jugadorKey][cat] === null) {
            categoriasDisponibles.push(cat);
        }
    });
    
    if (categoriasDisponibles.length > 0) {
        // Seleccionar la primera categoría disponible automáticamente
        const categoria = categoriasDisponibles[0];
        seleccionarCategoria(categoria, jugadorActual);
    }
}

// Añadir función para actualizar el texto de tiros
function actualizarTirosInfo() {
    document.getElementById('tiro-actual').textContent = tiroActual;
}

// Cambiar turno
function cambiarTurno() {
    jugadorActual = jugadorActual === 0 ? 1 : 0;
    
    // Reiniciar dados
    dados = [1, 1, 1, 1, 1];
    dadosBloqueados = [false, false, false, false, false];
    tiroActual = 1;
    
    // Ocultar dados
    ocultarDados();
    
    // Actualizar interfaz
    actualizarControles();
    actualizarTurnoVisual();
    actualizarTirosInfo();
    
    // Verificar si el juego terminó
    if (juegoTerminado()) {
        finalizarJuego();
    }
}

// Ocultar dados
function ocultarDados() {
    const dadosElements = document.querySelectorAll('.dice');
    dadosElements.forEach(dado => {
        dado.classList.remove('visible', 'bloqueado');
    });
}

// Actualizar visualización del turno
function actualizarTurnoVisual() {
    // Remover clase de turno actual de todos los headers
    const headers = document.querySelectorAll('.header-row');
    headers.forEach(header => header.classList.remove('turno-actual'));
    
    // Agregar clase al jugador actual
    const jugadorActualHeader = document.getElementById(`jugador${jugadorActual + 1}-nombre`);
    if (jugadorActualHeader) {
        jugadorActualHeader.classList.add('turno-actual');
    }
}

// Verificar si el juego terminó
function juegoTerminado() {
    const p1Completo = Object.keys(puntuaciones.p1).every(key => 
        key === 'total' || puntuaciones.p1[key] !== null
    );
    const p2Completo = Object.keys(puntuaciones.p2).every(key => 
        key === 'total' || puntuaciones.p2[key] !== null
    );
    
    return p1Completo && p2Completo;
}

// Finalizar juego
function finalizarJuego() {
    const ganador = puntuaciones.p1.total > puntuaciones.p2.total ? 1 : 
                   puntuaciones.p2.total > puntuaciones.p1.total ? 2 : 0;
    
    let mensaje = '';
    if (ganador === 0) {
        mensaje = '¡Empate!';
    } else {
        const perfiles = Storage.cargar("perfiles");
        const nombreGanador = perfiles && perfiles[ganador - 1] ? perfiles[ganador - 1].nombre : `Cliente ${ganador}`;
        mensaje = `¡${nombreGanador} gana con ${puntuaciones[ganador === 1 ? 'p1' : 'p2'].total} puntos!`;
    }
    
    setTimeout(() => {
        alert(`🎉 Juego terminado!\n\n${mensaje}\n\nP1: ${puntuaciones.p1.total} puntos\nP2: ${puntuaciones.p2.total} puntos`);
    }, 500);
}

// Actualizar tablero
function actualizarTablero() {
    // Actualizar puntuaciones del jugador 1
    Object.keys(puntuaciones.p1).forEach(cat => {
        if (cat !== 'total') {
            const elemento = document.getElementById(`p1-${cat}`);
            if (elemento) {
                elemento.textContent = puntuaciones.p1[cat] !== null ? puntuaciones.p1[cat] : '-';
                elemento.className = puntuaciones.p1[cat] !== null ? 'score-row completado' : 'score-row';
            }
        }
    });
    
    // Actualizar puntuaciones del jugador 2
    Object.keys(puntuaciones.p2).forEach(cat => {
        if (cat !== 'total') {
            const elemento = document.getElementById(`p2-${cat}`);
            if (elemento) {
                elemento.textContent = puntuaciones.p2[cat] !== null ? puntuaciones.p2[cat] : '-';
                elemento.className = puntuaciones.p2[cat] !== null ? 'score-row completado' : 'score-row';
            }
        }
    });
    
    // Calcular totales
    calcularTotales();
}

// Calcular totales
function calcularTotales() {
    // Jugador 1
    const p1Total = ['as', 'doses', 'treses', 'cuatros', 'cincos', 'seis', 'poker', 'full', 'escalera', 'generala', 'dobleGenerala']
        .map(cat => puntuaciones.p1[cat] || 0)
        .reduce((sum, val) => sum + val, 0);
    
    puntuaciones.p1.total = p1Total;
    
    // Jugador 2
    const p2Total = ['as', 'doses', 'treses', 'cuatros', 'cincos', 'seis', 'poker', 'full', 'escalera', 'generala', 'dobleGenerala']
        .map(cat => puntuaciones.p2[cat] || 0)
        .reduce((sum, val) => sum + val, 0);
    
    puntuaciones.p2.total = p2Total;
    
    // Actualizar elementos del DOM
    document.getElementById('p1-total').textContent = p1Total;
    document.getElementById('p2-total').textContent = p2Total;
}

// Nuevo juego
function nuevoJuego() {
    if (confirm('¿Estás seguro de que quieres empezar un nuevo juego?')) {
        // Reiniciar variables
        dados = [1, 1, 1, 1, 1];
        dadosBloqueados = [false, false, false, false, false];
        tiroActual = 1;
        jugadorActual = 0;
        
        // Reiniciar puntuaciones
        puntuaciones = {
            p1: {
                as: null, doses: null, treses: null, cuatros: null, cincos: null, seis: null,
                poker: null, full: null, escalera: null, generala: null, dobleGenerala: null,
                total: 0
            },
            p2: {
                as: null, doses: null, treses: null, cuatros: null, cincos: null, seis: null,
                poker: null, full: null, escalera: null, generala: null, dobleGenerala: null,
                total: 0
            }
        };
        
        // Actualizar interfaz
        ocultarDados();
        actualizarControles();
        actualizarTurnoVisual();
        actualizarTablero();
        actualizarTirosInfo();
    }
}

// Mostrar reglas
function mostrarReglas() {
    const reglas = `🎲 REGLAS DE LA GENERALA\n\n📊 PUNTUACIONES:\n• Ases (1): Suma de todos los 1\n• Doses (2): Suma de todos los 2\n• Treses (3): Suma de todos los 3\n• Cuatros (4): Suma de todos los 4\n• Cincos (5): Suma de todos los 5\n• Seis (6): Suma de todos los 6\n\n🎯 COMBINACIONES:\n• Poker: 4 dados iguales (40 puntos)\n• Full: 3 de un número + 2 de otro (30 puntos)\n• Escalera: 5 números consecutivos (20 puntos)\n• Generala: 5 dados iguales (50 puntos)\n• Doble Generala: 5 dados iguales (100 puntos)\n\n🎮 CÓMO JUGAR:\n1. Tira los dados (máximo 3 veces)\n2. Bloquea los dados que quieras conservar\n3. Anota en una categoría disponible\n4. Cambia el turno\n5. ¡El que más puntos tenga gana!`;
    document.getElementById('texto-reglas').textContent = reglas;
    document.getElementById('modal-reglas').classList.remove('nodisp');
}

function cerrarModalReglas() {
    document.getElementById('modal-reglas').classList.add('nodisp');
}

// Función para volver al menú
function volverAlMenu() {
    window.location.href = '../menu.html';
}
