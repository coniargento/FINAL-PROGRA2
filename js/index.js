document.addEventListener('deviceready', listo, false);

const cantJugadores = 2;

function listo() {
    let perfiles = Storage.cargar("perfiles");
    if (perfiles === null){
        window.location.href = "perfil.html?player=0";
    } else if (perfiles.length < cantJugadores) {
        window.location.href = "perfil.html?player=" + perfiles.length;
    } else {
        window.location.href = "menu.html";
    }
}
