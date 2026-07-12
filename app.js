window.addEventListener("DOMContentLoaded", () => {

    console.log("DOM cargado");

    // 👇 CHIVATO VISUAL: Si ves "v2.0" en la tablet, es el código nuevo.
    const labelBoton = document.querySelector(".custom-file-upload");
    if (labelBoton) {
        labelBoton.innerHTML = "📁 Seleccionar .glb (v1.1)";
    }
    
    // --- 1. SELECCIÓN DE ELEMENTOS DEL DOM ---
    const input = document.getElementById("archivo");
    const visor = document.getElementById("visor");
    const btnMas = document.getElementById("btn-mas");
    const btnMenos = document.getElementById("btn-menos");
    
    // --- 2. CONFIGURACIÓN DE ESCALA ---
    let escalaActual = 0.01; 
    const pasoEscala = 0.005; 

    // --- 3. LÓGICA DE LOS BOTONES DE ESCALADO ---
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
    
    // --- 4. EVENTOS DE DIAGNÓSTICO DEL MODELO 3D ---
    visor.addEventListener("model-loaded", () => {
        console.log("MODELO CARGADO");
    });
    
    visor.addEventListener("model-error", (e) => {
        console.log("ERROR CARGANDO MODELO");
        console.log(e.detail);
    });

    // --- 5. LÓGICA DE CARGA DEL ARCHIVO LOCAL (.GLB) ---
    let urlActual = null;

    input.addEventListener("change", function () {
        console.log("Cambio de archivo");
        const archivo = this.files[0];
        if (!archivo) return;

        if (urlActual) {
            URL.revokeObjectURL(urlActual);
        }

        urlActual = URL.createObjectURL(archivo);
        console.log("URL generada:", urlActual);

        // Si ya estamos traqueando una cara activa en este momento, lo asignamos directamente
        visor.setAttribute("gltf-model", urlActual);
        visor.setAttribute("visible", true);
        console.log("Modelo asignado manualmente desde el input");
    });

    // --- 6. LÓGICA DE TRACKING DINÁMICO PARA LAS 6 CARAS ---
    const caras = [
        { el: document.getElementById("cara-superior"),  rot: "0 0 0" },       
        { el: document.getElementById("cara-frontal"),   rot: "90 0 0" },      
        { el: document.getElementById("cara-derecha"),   rot: "0 0 -90" },     
        { el: document.getElementById("cara-izquierda"), rot: "0 0 90" },      
        { el: document.getElementById("cara-trasera"),   rot: "-90 0 180" },   
        { el: document.getElementById("cara-inferior"),  rot: "180 0 0" }      
    ];

    caras.forEach((cara) => {
        if (cara.el) {
            cara.el.addEventListener("targetFound", () => {
                console.log("Cara detectada. Reubicando estructura...");
                
                // 1. Mudamos el visor a la nueva cara activa
                cara.el.appendChild(visor);
                
                // 2. Aplicamos la rotación correspondiente
                visor.setAttribute("rotation", cara.rot);
                
                // 3. ¡EL FIX CRÍTICO! Si ya había un archivo seleccionado previamente,
                // se lo volvemos a inyectar al nodo para asegurar que A-Frame lo vuelva a renderizar
                if (urlActual) {
                    visor.setAttribute("gltf-model", urlActual);
                }

                // 4. Forzamos la actualización de matrices tridimensionales
                if (visor.components && visor.components.position) {
                    visor.components.position.update();
                    visor.components.rotation.update();
                }

                visor.setAttribute("visible", true);
            });
        }
    });


    
});
