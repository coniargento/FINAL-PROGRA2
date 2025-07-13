const cantJugadores = 2;

let perfiles = [];
let jugador = 0;

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarPerfil);

function cargarPerfil() {
    document.getElementById("btn-guardar-perfil").addEventListener("click", guardarPerfil, false);

    perfiles = Storage.cargar("perfiles") || [];
    jugador = Number(new URLSearchParams (window.location.search).get("player"));

    document.getElementById("jugador").innerHTML = jugador + 1;

    if(perfiles[jugador]) {
        document.getElementById("nombre").value = perfiles[jugador].nombre;
        document.getElementById("apodo").value = perfiles[jugador].apodo;
        document.getElementById("color").value = perfiles[jugador].color;
        document.getElementById("foto").setAttribute("src", perfiles[jugador].foto);
    }
}

function guardarPerfil(e) {
    //previene que se envie el formulario
    e.preventDefault();
    //Reseteo el estado de validación del formulario
    ["nombre", "apodo", "color", "foto"]
        .forEach(campo => document.getElementById(campo).classList.remove("notValid"));
    //guardar los datos si el formulario es valido
    if(validarForm()){
        perfiles[jugador] = {
            nombre: document.getElementById("nombre").value,
            apodo: document.getElementById("apodo").value,
            color: document.getElementById("color").value,
            foto: document.getElementById("foto").getAttribute("src")
        }
        Storage.guardar("perfiles", perfiles);

        if (perfiles.length < cantJugadores) {
            window.location.href = "perfil.html?player=" + perfiles.length;
        } else {
            window.location.href = "menu.html";
        }
    }
}

function validarForm( ){
    let campos = ["nombre", "apodo", "color"];

    for (const campo of campos){
        const el = document.getElementById(campo);
        const valor = el.value;

        if (valor. length < 3 || !esValido (campo, valor)) {
            el.classList.add ("notValid");
            el.focus();
            return false;
            } else {
                el.classList.remove("notValid");
            }
    }

    const img = document.getElementById("foto");
    const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI2NjYyIvPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iI2NjYyIvPgo8L3N2Zz4=";
    if(img.getAttribute("src") === defaultImage){
        //todavía no se seleccionó la foto y no es valido
        img.classList.add("notValid");
        img.focus();
        return false;
    } else {
        img.classList.remove("notValid");
    }

    return true;
}

function esValido(propiedad, valor){
    let found = false;
    for (let i = 0; !found && i < perfiles.length; i++){
        found = perfiles[i][propiedad] === valor;
    }
    return !found;
}

function sacarFoto(){
    // Usar input file para seleccionar imagen
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("foto").setAttribute("src", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}