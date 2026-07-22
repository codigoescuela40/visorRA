window.addEventListener("DOMContentLoaded", () => {

    console.log("DOM cargado en Local - Matriz de Espejos");
    
    const input = document.getElementById("archivo");
    const btnMas = document.getElementById("btn-mas");
    const btnMenos = document.getElementById("btn-menos");
    const modeloCargado = document.getElementById("modelo-cargado");    
    const zoomInfo = document.getElementById("zoom-info");
    
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
    
    function actualizarZoom() {
        zoomInfo.textContent = `Zoom x${zoomUsuario.toPrecision(3)}`;
    }
    
    let urlActual = null;

    // --- LÓGICA DE CARGA: SE INYECTA A LOS 6 VISORES AL MISMO TIEMPO ---
    input.addEventListener("change", function () {
        console.log("Cambio de archivo detectado");
        const archivo = this.files[0];
        if (!archivo) return;
        const extension = archivo.name.toLowerCase().split(".").pop();
        
        // Reiniciar zoom para cada nuevo modelo
        zoomUsuario = 1;
        actualizarZoom();
        
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
                    actualizarZoom();
                }
            );
        } else if (extension === "stl") {
            ModelLoader.cargarSTL(urlActual, visores, escalaActual);
        } else {
            alert("Formato no soportado");
        }
        
    });

    // --- LÓGICA DE BOTONES: ESCALAN LOS 6 VISORES EN PARALELO ---
    btnMas.addEventListener("click", () => {
        escalaActual *= FACTOR_ESCALA;
        actualizarZoom();    
        visores.forEach((visor) => {
            visor.setAttribute(
                "scale",
                `${escalaActual} ${escalaActual} ${escalaActual}`
            );
        });
    
        console.log("Escala:", escalaActual);
    });
    
    btnMenos.addEventListener("click", () => {
        escalaActual /= FACTOR_ESCALA;
        actualizarZoom();
        visores.forEach((visor) => {
            visor.setAttribute(
                "scale",
                `${escalaActual} ${escalaActual} ${escalaActual}`
            );
        });
    
        console.log("Escala:", escalaActual);
    });

    actualizarZoom();
});


