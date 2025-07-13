const cantJugadores = 2;

// Función para inicializar la aplicación
function inicializarApp() {
    let perfiles = Storage.cargar("perfiles");
    if (perfiles === null){
        window.location.href = "perfil.html?player=0";
    } else if (perfiles.length < cantJugadores) {
        window.location.href = "perfil.html?player=" + perfiles.length;
    } else {
        window.location.href = "menu.html";
    }
}

// Inicializar después de un pequeño delay para mostrar la pantalla de carga
setTimeout(inicializarApp, 2000);
