window.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("archivo");
    const modeloCargado = document.getElementById("modelo-cargado");    
    const zoomSlider = document.getElementById("zoom-slider");
    const lightSlider = document.getElementById("light-slider");
    const luzAmbiente = document.getElementById("luz-ambiente");
    const luz1 = document.getElementById("luz-1");
    const luz2 = document.getElementById("luz-2");
    const luz3 = document.getElementById("luz-3");
    const xSlider = document.getElementById("x-slider");
    const ySlider = document.getElementById("y-slider");
    const zSlider = document.getElementById("z-slider");
    const botonesColor = document.querySelectorAll(".color-btn");
    
    // En lugar de un solo visor, seleccionamos los 6 visores del cubo
    const visores = document.querySelectorAll(".visor-cubo");
    
    let escalaBase = 0.01;
    let zoomUsuario = 1;
    const FACTOR_ESCALA = 1.2;
    
    function aplicarEscala() {
        const escala = escalaBase * zoomUsuario;
        visores.forEach((visor) => {
            visor.setAttribute(
                "scale",
                `${escala} ${escala} ${escala}`
            );
        });
    }
    function aplicarPosicion() {
        const x = parseFloat(xSlider.value);
        const y = parseFloat(ySlider.value);
        const z = parseFloat(zSlider.value);
    
        visores.forEach((visor) => {
            visor.setAttribute(
                "position",
                `${x} ${y} ${z}`
            );
        });
    }
   
    let urlActual = null;

    // --- LÓGICA DE CARGA: SE INYECTA A LOS 6 VISORES AL MISMO TIEMPO ---
    input.addEventListener("change", function () {
        //console.log("Cambio de archivo detectado");
        const archivo = this.files[0];
        if (!archivo) return;
        const extension = archivo.name.toLowerCase().split(".").pop();
        
        // Reiniciar zoom para cada nuevo modelo
        zoomUsuario = 1;
        zoomSlider.value = 1;
        lightSlider.value = 1.5;
        lightSlider.dispatchEvent(new Event("input"));
        xSlider.value = 0;
        ySlider.value = 0;
        zSlider.value = 0;
        // Restaurar selección de la paleta
        botonesColor.forEach(b => b.classList.remove("activo"));
        document
            .querySelector('[data-color="original"]')
            .classList.add("activo");
        
        aplicarPosicion();

        
        modeloCargado.textContent = archivo.name;
        
        if (urlActual) {
            URL.revokeObjectURL(urlActual);
        }

        urlActual = URL.createObjectURL(archivo);
        console.log("Nueva URL Blob generada:", urlActual);

        // Cargamos los visores
        if (extension === "glb") {
            ModelLoader.cargarGLB(urlActual, visores, 0.01, (escala) => {
                    escalaBase = escala;
                    aplicarEscala();
                }
            );
        } else if (extension === "stl") {
            ModelLoader.cargarSTL(urlActual, visores, 0.01, (escala) => {
                    escalaBase = escala;
                    aplicarEscala();
                }
            );
        } else {
            alert("Formato no soportado");
        }
        
    });

    zoomSlider.addEventListener("input", () => {
        zoomUsuario = parseFloat(zoomSlider.value);
        aplicarEscala();
    });

    lightSlider.addEventListener("input", () => {
        const intensidad = parseFloat(lightSlider.value);
        luzAmbiente.setAttribute("light", "intensity", intensidad);
        luz1.setAttribute("light", "intensity", intensidad * 0.8);
        luz2.setAttribute("light", "intensity", intensidad * 0.8);
        luz3.setAttribute("light", "intensity", intensidad * 0.4);
    });
    
    xSlider.addEventListener("input", aplicarPosicion);

    ySlider.addEventListener("input", aplicarPosicion);

    zSlider.addEventListener("input", aplicarPosicion);
    
    lightSlider.dispatchEvent(new Event("input"));

    botonesColor.forEach((boton) => {
    
        boton.addEventListener("click", () => {
    
            // Marcar botón activo
            botonesColor.forEach(b => b.classList.remove("activo"));
            boton.classList.add("activo");
    
            // Cambiar color del modelo
            ModelLoader.cambiarColor(boton.dataset.color);
    
        });
    
    });

    
});

