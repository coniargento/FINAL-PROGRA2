const Storage = {
    cargar: key => {
        try {
            console.log("Intentando cargar:", key);
            const item = localStorage.getItem(key);
            console.log("Item raw:", item);
            const parsed = JSON.parse(item);
            console.log("Item parsed:", parsed);
            return parsed;
        } catch (x) {
            console.error("No se pudo leer el item" + key + ". Error: " + x);
            return null;
        }
    },
    guardar: (key, obj) => {
        localStorage.setItem(key, JSON.stringify(obj)) //stringify: te convierte un objeto en string
    },
    borrar: key => {
        localStorage.removeItem(key);
    },
    limpiar: () => {
        localStorage.clear();
    }
}

const Utils = {
    validarCamposDeTexto: (campos, longMin, funcValidacion) => {
        for(const campo of campos) {
            const el = document.getElementsByName(campo);
            const valor = el.value;
            
            if (valor. length < 3 || !esValido (campo, valor)) {
                el.classList.add ("notValid");
                el.focus();
                return false;
                } else {
                    el.classList.remove("notValid");
                }
        }
    }
}

//local host: seria como el dominio inventado para la aplicación