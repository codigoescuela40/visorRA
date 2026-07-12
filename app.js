window.addEventListener("DOMContentLoaded", () => {

    console.log("DOM cargado");

    const input = document.getElementById("archivo");
    const visor = document.getElementById("visor");
    const btnMas = document.getElementById("btn-mas");
    const btnMenos = document.getElementById("btn-menos");
    
    // Factor de escala inicial (coincide con tu HTML: 0.01)
    let escalaActual = 0.01; 
    const pasoEscala = 0.02; // Cuánto aumenta/decrece cada vez
    
    btnMas.addEventListener("click", () => {
        escalaActual += pasoEscala;
        visor.setAttribute("scale", `${escalaActual} ${escalaActual} ${escalaActual}`);
    });
    
    btnMenos.addEventListener("click", () => {
        if (escalaActual > pasoEscala) { // Evita escalas negativas
            escalaActual -= pasoEscala;
            visor.setAttribute("scale", `${escalaActual} ${escalaActual} ${escalaActual}`);
        }
    });
    
    visor.addEventListener("model-loaded", () => {
        console.log("MODELO CARGADO");
    });
    
    visor.addEventListener("model-error", (e) => {
        console.log("ERROR CARGANDO MODELO");
        console.log(e.detail);
    });

    console.log("input:", input);
    console.log("visor:", visor);

    let urlActual = null;

    input.addEventListener("change", function () {

        console.log("Cambio de archivo");

        const archivo = this.files[0];

        if (!archivo) return;

        if (urlActual) {
            URL.revokeObjectURL(urlActual);
        }

        urlActual = URL.createObjectURL(archivo);

        console.log("URL:", urlActual);

        console.log("Antes de asignar modelo");

        visor.setAttribute("gltf-model", urlActual);

        visor.setAttribute("visible", true);

        console.log("Modelo asignado");

    });

});
