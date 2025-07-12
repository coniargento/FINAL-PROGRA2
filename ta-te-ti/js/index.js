// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', listo, false);

let juego = {
    tabla : [["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"], ["&nbsp;", "&nbsp;", "&nbsp;"]], // fichas en el tablero
    jugadas : 0, // las jugadas que se hicieron hasta el momento
    turnos : tirarMoneda(),
    ganador : 0
};
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
    document.getElementById("turnos").innerHTML = juego.turnos;
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
            juego.tabla [r] [c] = juego.turnos === 1 ? "x" : "0";
            hacerTabla();
            if (esTaTeTi(juego.tabla[r][c])) {
                juego.ganador = juego.turnos;
                juego.jugadas = 9;
                terminado();
            } else{
                juego.jugadas++;
                if(juego.jugadas === 9) {
                    terminado();
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
        msg = "Ganó el jugador " + juego.ganador;
    }
    document.querySelector("#juego-terminado .mensaje").innerHTML = msg;
    document.getElementById("juego-terminado").classList.remove("nodisp");
}

function listo() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    empezarJuego();

    hacerTabla();
}
