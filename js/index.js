const cantJugadores = 2;

// Función para inicializar la aplicación
function inicializarApp() {
    console.log("Inicializando aplicación...");
    let perfiles = Storage.cargar("perfiles");
    console.log("Perfiles cargados:", perfiles);
    
    if (perfiles === null || perfiles.length < cantJugadores) {
        console.log("Redirigiendo a perfil.html");
        window.location.href = "perfil.html";
    } else {
        console.log("Redirigiendo a menu.html");
        window.location.href = "menu.html";
    }
}

// Inicializar después de un pequeño delay para mostrar la pantalla de carga
setTimeout(inicializarApp, 2000);
