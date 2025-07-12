document.addEventListener('deviceready', listo, false);

const cantJugadores = 2;

let perfiles = [];
let jugador = 0;

function listo(){
    cargarPerfil();
}

function cargarPerfil() {
    document.getElementById("btn-guardar-perfil").addEventListener("click", guardarPerfil, false);

    perfiles = Storage.cargar("perfiles") || [];
    jugador = Number(new URLSearchParams (window.location.search).get("jugador"));

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
            window.location.href = "perfil.html?jugador=" + perfiles.length;
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
    if(img.getAttribute("src") === "img/person.png"){
        //todavía no se saco la foto y no es valido
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
    navigator.camera.getPicture(foto, fotoError, {
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function foto(data){
    document.getElementById("foto").setAttribute("src", "data:image/jpeg;base64," + data);
}

function fotoError(err){
    console.error("No se puede tomar la foto", err);
}