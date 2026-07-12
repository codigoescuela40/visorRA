window.addEventListener("DOMContentLoaded", () => {

    console.log("DOM cargado");
    
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

        console.log("URL:", urlActual);

        console.log("Antes de asignar modelo");

        visor.setAttribute("gltf-model", urlActual);

        visor.setAttribute("visible", true);

        console.log("Modelo asignado");

    });

    // --- 6. LÓGICA DE TRACKING DINÁMICO PARA LAS 6 CARAS ---
    // Mapeamos cada entidad del HTML con su rotación compensatoria en grados (X Y Z)
    // El orden de los índices (0 al 5) debe coincidir con tu lista en el compilador de MindAR

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
                console.log("Cara detectada. Moviendo e inicializando visor...");
                
                // 1. Teletransportamos el objeto a la nueva cara
                cara.el.appendChild(visor);
                
                // 2. Aplicamos la rotación correspondiente a esta cara
                visor.setAttribute("rotation", cara.rot);
                
                // 3. ¡EL TRUCO! Forzamos a A-Frame a recalcular la posición en el espacio
                if (visor.components && visor.components.position) {
                    visor.components.position.update();
                    visor.components.rotation.update();
                }

                // 4. Aseguramos la visibilidad (a veces se desactiva al mudar el nodo)
                visor.setAttribute("visible", true);
            });

            cara.el.addEventListener("targetLost", () => {
                // Opcional: Si notas que el objeto parpadea mucho al girar, 
                // puedes dejar este evento vacío para que no oculte el objeto 
                // hasta que encuentre la siguiente cara.
            });
        }
    });

    
});
