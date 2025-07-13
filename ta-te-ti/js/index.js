let juego = {
    tabla : [["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"]], // fichas en el tablero
    jugadas : 0, // las jugadas que se hicieron hasta el momento
    turnos : tirarMoneda(),
    ganador : 0
};

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ta-Te-Ti iniciado');
    empezarJuego();
    hacerTabla();
    crearParticulas();
});

function crearParticulas() {
    const particulas = ['☕', '🍰', '☕', '🍰'];
    setInterval(() => {
        const particula = document.createElement('div');
        particula.className = 'particula';
        particula.textContent = particulas[Math.floor(Math.random() * particulas.length)];
        particula.style.left = Math.random() * window.innerWidth + 'px';
        document.querySelector('.game-container').appendChild(particula);
        
        setTimeout(() => {
            if (particula.parentNode) {
                particula.parentNode.removeChild(particula);
            }
        }, 6000);
    }, 2000);
}

document.getElementById("turnos").innerHTML = juego.turnos;

function empezarJuego() {
    juego = {
        tabla : [["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"]],
        jugadas : 0,
        turnos: juego.turnos === 1 ? 2 : 1,
        ganador: 0
    };
    document.getElementById("juego-terminado").classList.add("nodisp");
    hacerTabla();
};

function tirarMoneda() {
    return Math.random() > 0.5 ? 1 : 2;
}

function hacerTabla() {
    const cont = document.querySelector("#ta-te-ti tbody");
    const turnoEmoji = juego.turnos === 1 ? "☕" : "🍰";
    document.getElementById("turnos").innerHTML = turnoEmoji;
    document.getElementById("turnos-display").innerHTML = turnoEmoji;
    for (let r = 0; r < 3; r++){
        for (let c = 0; c < 3; c++) {
            cont.querySelector("tr:nth-of-type(" + (r + 1) + ") td:nth-of-type(" + (c + 1) + ")")
                .innerHTML = juego.tabla[r][c];
        }
    }
   
}

function jugar(r, c) {
    if(juego.jugadas < 9) {
        if(juego.tabla [r] [c] === "&nbsp;") {
            const ficha = juego.turnos === 1 ? "☕" : "🍰";
            juego.tabla [r] [c] = ficha;
            
            // Efecto visual al colocar ficha
            const celda = document.querySelector(`#ta-te-ti tbody tr:nth-of-type(${r + 1}) td:nth-of-type(${c + 1})`);
            celda.style.transform = 'scale(0.8)';
            celda.style.opacity = '0.5';
            
            setTimeout(() => {
                celda.style.transform = 'scale(1.1)';
                celda.style.opacity = '1';
                setTimeout(() => {
                    celda.style.transform = 'scale(1)';
                }, 200);
            }, 100);
            
            hacerTabla();
            
            if (esTaTeTi(juego.tabla[r][c])) {
                juego.ganador = juego.turnos;
                juego.jugadas = 9;
                setTimeout(() => terminado(), 500);
            } else{
                juego.jugadas++;
                if(juego.jugadas === 9) {
                    setTimeout(() => terminado(), 500);
                }
                juego.turnos = juego.turnos === 1 ? 2 : 1; 
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
        msg = `¡Ganó ${ganadorEmoji}!`;
        crearConfeti();
    }
    document.querySelector("#juego-terminado .mensaje").innerHTML = msg;
    document.getElementById("juego-terminado").classList.remove("nodisp");
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
    const reglas = `
☕ REGLAS DEL TA-TE-TI

🎮 CÓMO JUGAR:
• El jugador ☕ (Café) va primero
• El jugador 🍰 (Pastel) va segundo
• Haz clic en cualquier casilla vacía para colocar tu ficha
• El objetivo es alinear 3 fichas en línea (horizontal, vertical o diagonal)

🏆 GANADOR:
• El primer jugador en alinear 3 fichas gana
• Si todas las casillas están llenas sin ganador, es empate

☕ ¡Disfruta tu café mientras juegas!
    `;
    
    alert(reglas);
}
