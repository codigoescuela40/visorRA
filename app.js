window.addEventListener("DOMContentLoaded", () => {

    console.log("DOM cargado en Local - Matriz de Espejos");
    
    const input = document.getElementById("archivo");
    const btnMas = document.getElementById("btn-mas");
    const btnMenos = document.getElementById("btn-menos");
    const modeloCargado = document.getElementById("modelo-cargado");    
    const zoomInfo = document.getElementById("zoom-info");
    
    // En lugar de un solo visor, seleccionamos los 6 visores del cubo
    const visores = document.querySelectorAll(".visor-cubo");
    
    let escalaActual = 0.01;
    const FACTOR_ESCALA = 1.2; 
    function actualizarZoom() {
        const zoom = escalaActual / 0.01;
        zoomInfo.textContent = `Zoom x${zoom.toPrecision(3)}`;
    }
    
    let urlActual = null;

    // --- LÓGICA DE CARGA: SE INYECTA A LOS 6 VISORES AL MISMO TIEMPO ---
    input.addEventListener("change", function () {
        console.log("Cambio de archivo detectado");
        const archivo = this.files[0];
        if (!archivo) return;
        
        // Reiniciar zoom para cada nuevo modelo
        escalaActual = 0.01;
        actualizarZoom();
        
        modeloCargado.textContent = archivo.name;
        
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

visor.addEventListener("model-loaded", (e) => {

    e.detail.model.traverse((obj) => {
console.log(obj.material.color);
        if (!obj.isMesh) return;

        // Eliminar los colores por vértice
        delete obj.geometry.attributes.color;

        // Desactivar vertex colors
        obj.material.vertexColors = false;

        // Poner un color visible
        obj.material.color.set("#ff0000");

        obj.material.needsUpdate = true;

    });

});

            
        });
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


