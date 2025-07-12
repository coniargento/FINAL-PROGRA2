const juego = {
    dados: [],
    seleccionados: [],
    cantJugadores: 2,
    turno: 0,
    puntos: {
        "1": [], //Acá hay un array de acuerdo a juego.jugadores
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": [],
        "E": [],
        "F": [],
        "P": [],
        "G": [],
        "D": [],
        "T": [],
    },
    dadosTamaño: 150
}; // juego.puntos["3"][1] es la forma de acceder a las propiedades de los objetos, el subindice no es el número si no que es el string con el número de la propiedad, se le llama diccionario

const cuarto = juego.dadosTamaño * 0.25;
const mitad = juego.dadosTamaño * 0.5;
const trescuartos = juego.dadosTamaño * 0.75;
const radio = juego.dadosTamaño * 0.1;

document.addEventListener('deviceready', onDeviceReady, false);

function iniciarPuntaje() {
    const puntaje = [];
    for(let i = 0; i < juego.cantJugadores; i++){
        puntaje.push(0);
    }
    return puntaje;
}

function numAlAzar(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function mostrarDados() {
    const cont = document.getElementById("dados");
    cont.innerHTML = null;
    for (let i = 0; i < 5; i++){
      cont.appendChild(mostrarDado(i, juego.dados[i]));
    }
}

const mostrarDado = (i, numero) => {

    let dado = document.createElement("canvas");

    dado.classList.add ("dado");

    dado.setAttribute("width", "" + juego.dadosTamaño);

    dado.setAttribute("height", "" + juego.dadosTamaño);

    dado.style.borderRadius = (juego.dadosTamaño / 100) + "em";

    dado.style.margin = (juego.dadosTamaño / 200) + "em";

    dibujarDado(dado, numero);

    //dado.onclick = () => {seleccionar(dado);}

    return dado;
};

function dibujarDado(cont, numero) {
    let ctx = cont.getContext("2d");

    ctx.clearReact(0, 0, juego.dadosTamaño, juego.dadosTamaño);

    ctx.beginPath();
    ctx.rect(0, 0, juego.dadosTamaño, juego.dadosTamaño);
    ctx.fillStyle = "#FFFFFF";
    ctx.closePath();

    //borro

     ctx.clearRect (0, 0, juego.dadosTamaño, juego.dadosTamaño);

     //dado

     ctx.beginPath();

     ctx.rect(0, 0, juego.dadosTamaño, juego.dadosTamaño);

     ctx.fillStyle ="#FFFFFF";

     ctx.fill();

     ctx.closePath();

     switch (numero){

            case 1: 
                dibujarCirculo(ctx, mitad, mitad);
                break;

            case 2:
                dibujarCirculo(ctx, trescuartos, cuarto);
                dibujarCirculo(ctx, cuarto, trescuartos);
                break;

            case 3:
                dibujarCirculo(ctx, trescuartos, cuarto);
                dibujarCirculo(ctx, cuarto, trescuartos);
                dibujarCirculo(ctx, mitad, mitad);
                break;

            case 4:
                dibujarCirculo(ctx, trescuartos, cuarto);
                dibujarCirculo(ctx, cuarto, trescuartos);
                dibujarCirculo(ctx, cuarto, cuarto);
                dibujarCirculo(ctx, trescuartos, trescuartos);
                break;

            case 5:
                dibujarCirculo(ctx, trescuartos, cuarto);
                dibujarCirculo(ctx, cuarto, trescuartos);
                dibujarCirculo(ctx, cuarto, cuarto);
                dibujarCirculo(ctx, trescuartos, trescuartos);
                dibujarCirculo(ctx, mitad, mitad);
                break;

            case 6:
                dibujarCirculo(ctx, trescuartos, cuarto);
                dibujarCirculo(ctx, cuarto, trescuartos);
                dibujarCirculo(ctx, cuarto, cuarto);
                dibujarCirculo(ctx, trescuartos, trescuartos);
                dibujarCirculo(ctx, cuarto, mitad);
                dibujarCirculo(ctx, trescuartos, mitad);
                break;

     }

}

function dibujarCirculo (ctx, x , y){
     
    ctx.beginPath();

    ctx.arc(x, y, radio, 0, 2 * Math.PI, false);

    ctx.fillStyle = "#000000";

    ctx.fill();

    ctx.closePath();

}

function tirarDados() {
    juego.dados = [];
    for(let i = 0; i < 5; i++) {
        if(juego.seleccionados[i]) {
            juego.dados.push(numAlAzar(1,6));
        }
    }
}

function empezarJuego() {
    juego.turno = numAlAzar(0, juego.cantJugadores - 1);
    ["1", "2", "3", "4", "5", "6", "E", "F", "P", "G", "D", "T"].forEach(key => {
        juego.puntos[key] = iniciarPuntaje(); 
    });

    juego.dados = [0, 0, 0, 0, 0];
    juego.seleccionados = [true, true, true, true, true ];
    //juego.dados = [0, 0, 0, 0, 0];
}

function esEscalera() {
    return /12345|23456|13456/.test(juego.dados.join(""));
}

function esGenerala() {
    return /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/.test(juego.dados.join(""));
}

function esPoker() {
    return /1{4}[2-6]|12222|13333|14444|15555|16666|2{4}[3-6]|23333|24444|25555|26666|3{4}[4-6]|34444|35555|36666|4{4}[5-6]|45555|46666|5{4}6|56666/.test(juego.dados.join(""));
}

function esFull() {
    return /1{2}[2-6]{3}|1{3}[2-6]{2}|2{2}[3-6]{3}|2{3}[3-6]{2}|3{2}[4-6]{3}|3{3}[4-6]{2}|4{2}[5-6]{3}|4{3}[5-6]{2}|5{2}6{3}|5{3}6{2}/.test(juego.dados.join(""));
}

function recargarDado() {

}

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    empezarJuego();
    tirarDados();
    mostrarDados();
}
