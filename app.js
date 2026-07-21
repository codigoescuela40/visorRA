window.addEventListener("DOMContentLoaded", () => {

    console.log("DOM cargado en Local - Matriz de Espejos");
    
    const input = document.getElementById("archivo");
    const btnMas = document.getElementById("btn-mas");
    const btnMenos = document.getElementById("btn-menos");
    
    // En lugar de un solo visor, seleccionamos los 6 visores del cubo
    const visores = document.querySelectorAll(".visor-cubo");
    
    let escalaActual = 0.01;
    const FACTOR_ESCALA = 1.2; 

    let urlActual = null;

    // --- LÓGICA DE CARGA: SE INYECTA A LOS 6 VISORES AL MISMO TIEMPO ---
    input.addEventListener("change", function () {
        console.log("Cambio de archivo detectado");
        const archivo = this.files[0];
        if (!archivo) return;

        if (urlActual) {
            URL.revokeObjectURL(urlActual);
        }

        urlActual = URL.createObjectURL(archivo);
        console.log("Nueva URL Blob generada:", urlActual);

        // Recorremos los 6 visores e inyectamos el modelo de forma estable
        visores.forEach((visor) => {
            visor.setAttribute("gltf-model", urlActual);
            visor.setAttribute("scale", `${escalaActual} ${escalaActual} ${escalaActual}`);
            visor.setAttribute("visible", true);
            
            // Añadimos un escuchador individual por si queremos diagnosticar alguno
            visor.addEventListener("model-loaded", () => {
                console.log("Espejo de cara inicializado con éxito");
            });
        });
    });

    // --- LÓGICA DE BOTONES: ESCALAN LOS 6 VISORES EN PARALELO ---
    btnMas.addEventListener("click", () => {
        escalaActual *= FACTOR_ESCALA;
    
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
    
        visores.forEach((visor) => {
            visor.setAttribute(
                "scale",
                `${escalaActual} ${escalaActual} ${escalaActual}`
            );
        });
    
        console.log("Escala:", escalaActual);
    });
});


