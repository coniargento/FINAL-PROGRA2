let juego = {
    tabla : [["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"]], // fichas en el tablero
    jugadas : 0, // las jugadas que se hicieron hasta el momento
    turnos : tirarMoneda(),
    ganador : 0
};

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ta-Te-Ti iniciado');
    cargarPerfiles();
    empezarJuego();
    hacerTabla();
});

// Cargar perfiles de jugadores
function cargarPerfiles() {
    try {
        const perfilesGuardados = localStorage.getItem('perfiles');
        if (perfilesGuardados) {
            window.perfiles = JSON.parse(perfilesGuardados);
        } else {
            window.perfiles = [];
        }
    } catch (error) {
        console.log('Error al cargar perfiles:', error);
        window.perfiles = [];
    }
}





function empezarJuego() {
    juego = {
        tabla : [["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"]],
        jugadas : 0,
        turnos: juego.turnos === 1 ? 2 : 1,
        ganador: 0
    };
    document.getElementById("game-over-modal").classList.add("nodisp");
    hacerTabla();
};

function tirarMoneda() {
    return Math.random() > 0.5 ? 1 : 2;
}

function hacerTabla() {
    const cont = document.querySelector("#ta-te-ti tbody");
    
    // Obtener nombres de jugadores
    const jugador1 = window.perfiles[0] ? window.perfiles[0].nombre : "Jugador 1";
    const jugador2 = window.perfiles[1] ? window.perfiles[1].nombre : "Jugador 2";
    
    // Mostrar turno con nombre y emoji
    const turnoEmoji = juego.turnos === 1 ? "☕" : "🍰";
    const turnoNombre = juego.turnos === 1 ? jugador1 : jugador2;
    
    document.getElementById("turnos-display").innerHTML = turnoNombre;
    
    for (let r = 0; r < 3; r++){
        for (let c = 0; c < 3; c++) {
            const celda = cont.querySelector("tr:nth-of-type(" + (r + 1) + ") td:nth-of-type(" + (c + 1) + ")");
            if (juego.tabla[r][c] === "☕") {
                // Usar avatar del jugador 1
                let avatarJugador1 = "../img/avatar1.png"; // fallback
                if (window.perfiles[0] && window.perfiles[0].foto) {
                    // Convertir ruta relativa desde perfil a ruta desde ta-te-ti
                    const fotoSrc = window.perfiles[0].foto;
                    if (fotoSrc.includes("img/avatar")) {
                        avatarJugador1 = "../" + fotoSrc;
                    } else {
                        avatarJugador1 = fotoSrc;
                    }
                }
                celda.innerHTML = `<img src="${avatarJugador1}" alt="Avatar Jugador 1" class="ficha-img">`;
            } else if (juego.tabla[r][c] === "🍰") {
                // Usar avatar del jugador 2
                let avatarJugador2 = "../img/avatar2.png"; // fallback
                if (window.perfiles[1] && window.perfiles[1].foto) {
                    // Convertir ruta relativa desde perfil a ruta desde ta-te-ti
                    const fotoSrc = window.perfiles[1].foto;
                    if (fotoSrc.includes("img/avatar")) {
                        avatarJugador2 = "../" + fotoSrc;
                    } else {
                        avatarJugador2 = fotoSrc;
                    }
                }
                celda.innerHTML = `<img src="${avatarJugador2}" alt="Avatar Jugador 2" class="ficha-img">`;
            } else {
                celda.innerHTML = "";
            }
        }
    }
   
}

function jugar(r, c) {
    if(juego.jugadas < 9) {
        if(juego.tabla [r] [c] === "&nbsp;") {
            const ficha = juego.turnos === 1 ? "☕" : "🍰";
            juego.tabla [r] [c] = ficha;
            
            if (esTaTeTi(juego.tabla[r][c])) {
                juego.ganador = juego.turnos;
                juego.jugadas = 9;
                hacerTabla();
                setTimeout(() => terminado(), 500);
            } else{
                juego.jugadas++;
                juego.turnos = juego.turnos === 1 ? 2 : 1;
                hacerTabla();
                if(juego.jugadas === 9) {
                    setTimeout(() => terminado(), 500);
                }
            }
        } 
    } else {
        terminado();
    }
}

function esTaTeTi(jugador){
    return esTaTeTiHorizontal(jugador) || esTaTeTiVertical(jugador) || esTaTeTiDiagonal(jugador); // las tres variantes del tateti para que funcionen
}

function esTaTeTiVertical(jugador){
    return(
      (juego.tabla [0] [0] === jugador && juego.tabla [1] [0] === jugador &&  juego.tabla [2] [0] === jugador) ||
      (juego.tabla [0] [1] === jugador && juego.tabla [1] [1] === jugador &&  juego.tabla [2] [1] === jugador) ||
      (juego.tabla [0] [2] === jugador && juego.tabla [1] [2] === jugador &&  juego.tabla [2] [2] === jugador)
    );
  }

function esTaTeTiHorizontal(jugador){
    return(
      (juego.tabla [0] [0] === jugador && juego.tabla [0] [1] === jugador &&  juego.tabla [0] [2] === jugador) ||
      (juego.tabla [1] [0] === jugador && juego.tabla [1] [1] === jugador &&  juego.tabla [1] [2] === jugador) ||
      (juego.tabla [2] [0] === jugador && juego.tabla [2] [1] === jugador &&  juego.tabla [2] [2] === jugador)
    );
  }

function esTaTeTiDiagonal(jugador){
  return(
    (juego.tabla [0] [0] === jugador && juego.tabla [1] [1] === jugador &&  juego.tabla [2] [2] === jugador) ||
    (juego.tabla [0] [2] === jugador && juego.tabla [1] [1] === jugador &&  juego.tabla [2] [0] === jugador)
  );
}

function juegoGanador(){
    alert("JUGADOR" + juego.turnos + "GANO");
}

function terminado(){
    let msg = "Empate";
    if (juego.ganador !== 0) {
        const ganadorEmoji = juego.ganador === 1 ? "☕" : "🍰";
        const ganadorNombre = juego.ganador === 1 ? 
            (window.perfiles[0] ? window.perfiles[0].nombre : "Jugador 1") : 
            (window.perfiles[1] ? window.perfiles[1].nombre : "Jugador 2");
        msg = `¡Ganó ${ganadorNombre}!`;
        crearConfeti();
    }
    document.querySelector("#game-over-modal .mensaje").innerHTML = msg;
    document.getElementById("game-over-modal").classList.remove("nodisp");
}

function cerrarModal() {
    document.getElementById("game-over-modal").classList.add("nodisp");
    window.location.href = '../menu.html';
}

function crearConfeti() {
    const confeti = ['☕', '🍰', '🎉', '🏆', '⭐'];
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const elemento = document.createElement('div');
            elemento.textContent = confeti[Math.floor(Math.random() * confeti.length)];
            elemento.style.position = 'fixed';
            elemento.style.left = Math.random() * window.innerWidth + 'px';
            elemento.style.top = '-50px';
            elemento.style.fontSize = '2rem';
            elemento.style.pointerEvents = 'none';
            elemento.style.zIndex = '1000';
            elemento.style.animation = 'confetiFall 3s linear forwards';
            document.body.appendChild(elemento);
            
            setTimeout(() => {
                document.body.removeChild(elemento);
            }, 3000);
        }, i * 100);
    }
}

function mostrarReglas() {
    const reglas = `☕ REGLAS DEL TA-TE-TI\n\n🎮 CÓMO JUGAR:\n• El jugador ☕ (Café) va primero\n• El jugador 🍰 (Pastel) va segundo\n• Haz clic en cualquier casilla vacía para colocar tu ficha\n• El objetivo es alinear 3 fichas en línea (horizontal, vertical o diagonal)\n\n🏆 GANADOR:\n• El primer jugador en alinear 3 fichas gana\n• Si todas las casillas están llenas sin ganador, es empate\n\n☕ ¡Disfruta tu café mientras juegas!`;
    document.getElementById('texto-reglas').textContent = reglas;
    document.getElementById('modal-reglas').classList.remove('nodisp');
}

function cerrarModalReglas() {
    document.getElementById('modal-reglas').classList.add('nodisp');
}
