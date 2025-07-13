const cantJugadores = 2;
let perfiles = [];

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', cargarPerfiles);

function cargarPerfiles() {
    perfiles = Storage.cargar("perfiles") || [];
    
    // Cargar datos del jugador 1
    if (perfiles[0]) {
        document.getElementById("nombre1").value = perfiles[0].nombre || "";
        document.getElementById("apodo1").value = perfiles[0].apodo || "";
        document.getElementById("color1").value = perfiles[0].color || "#8B4513";
        document.getElementById("foto1").setAttribute("src", perfiles[0].foto || getDefaultImage());
    }
    
    // Cargar datos del jugador 2
    if (perfiles[1]) {
        document.getElementById("nombre2").value = perfiles[1].nombre || "";
        document.getElementById("apodo2").value = perfiles[1].apodo || "";
        document.getElementById("color2").value = perfiles[1].color || "#D2691E";
        document.getElementById("foto2").setAttribute("src", perfiles[1].foto || getDefaultImage());
    }
}

function guardarPerfil(numeroJugador) {
    // Reseteo el estado de validación del formulario
    const campos = ["nombre", "apodo", "color", "foto"];
    campos.forEach(campo => {
        const elemento = document.getElementById(campo + numeroJugador);
        if (elemento) elemento.classList.remove("notValid");
    });
    
    // Guardar los datos si el formulario es válido
    if (validarForm(numeroJugador)) {
        const jugadorIndex = numeroJugador - 1;
        
        perfiles[jugadorIndex] = {
            nombre: document.getElementById("nombre" + numeroJugador).value,
            apodo: document.getElementById("apodo" + numeroJugador).value,
            color: document.getElementById("color" + numeroJugador).value,
            foto: document.getElementById("foto" + numeroJugador).getAttribute("src")
        };
        
        Storage.guardar("perfiles", perfiles);
        
        // Mostrar mensaje de éxito
        mostrarMensaje(`Perfil del Jugador ${numeroJugador} guardado exitosamente!`);
    }
}

function validarForm(numeroJugador) {
    const campos = ["nombre", "apodo", "color"];
    
    for (const campo of campos) {
        const elemento = document.getElementById(campo + numeroJugador);
        const valor = elemento.value;
        
        if (valor.length < 3) {
            elemento.classList.add("notValid");
            elemento.focus();
            mostrarMensaje(`El campo ${campo} debe tener al menos 3 caracteres`, "error");
            return false;
        } else {
            elemento.classList.remove("notValid");
        }
    }
    
    const img = document.getElementById("foto" + numeroJugador);
    const defaultImage = getDefaultImage();
    
    if (img.getAttribute("src") === defaultImage) {
        img.classList.add("notValid");
        mostrarMensaje("Debes seleccionar una foto de perfil", "error");
        return false;
    } else {
        img.classList.remove("notValid");
    }
    
    return true;
}

function sacarFoto(numeroJugador) {
    // Usar input file para seleccionar imagen
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("foto" + numeroJugador).setAttribute("src", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function getDefaultImage() {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI2NjYyIvPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0iI2NjYyIvPgo8L3N2Zz4=";
}

function mostrarMensaje(mensaje, tipo = "success") {
    // Crear elemento de mensaje
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `mensaje ${tipo}`;
    mensajeElement.textContent = mensaje;
    mensajeElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        background: ${tipo === "error" ? "#e74c3c" : "#27ae60"};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(mensajeElement);
    
    // Remover mensaje después de 3 segundos
    setTimeout(() => {
        mensajeElement.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
            if (mensajeElement.parentNode) {
                mensajeElement.parentNode.removeChild(mensajeElement);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos CSS para las animaciones de mensajes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);