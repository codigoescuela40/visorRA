window.addEventListener("DOMContentLoaded", () => {

    console.log("DOM cargado correctamente");

    const input = document.getElementById("archivo");
    const visor = document.getElementById("visor");
    const contenedor = document.getElementById("contenedor-objeto");
    const btnMas = document.getElementById("btn-mas");
    const btnMenos = document.getElementById("btn-menos");

    let escalaActual = 0.03; 
    const pasoEscala = 0.005; 
    let urlActual = null;
    let modeloCargado = false; // Nos ayuda a saber si ya hay un modelo listo

    // --- CARGA DEL ARCHIVO GLB ---
    input.addEventListener("change", function () {
        const archivo = this.files[0];
        if (!archivo) return;

        if (urlActual) {
            URL.revokeObjectURL(urlActual);
        }

        urlActual = URL.createObjectURL(archivo);
        
        visor.setAttribute("gltf-model", urlActual);
        visor.setAttribute("scale", `${escalaActual} ${escalaActual} ${escalaActual}`);
        
        modeloCargado = true;
        // Si ya hay tracking activo, mostramos el contenedor
        if (contenedor.getAttribute("data-tracking-active") === "true") {
            contenedor.setAttribute("visible", true);
        }
        
        console.log("Modelo .glb memorizado correctamente.");
    });

    // --- BOTONES DE ESCALA ---
    if (btnMas && btnMenos) {
        btnMas.addEventListener("click", () => {
            escalaActual += pasoEscala;
            visor.setAttribute("scale", `${escalaActual} ${escalaActual} ${escalaActual}`);
        });

        btnMenos.addEventListener("click", () => {
            if (escalaActual > pasoEscala) {
                escalaActual -= pasoEscala;
                visor.setAttribute("scale", `${escalaActual} ${escalaActual} ${escalaActual}`);
            }
        });
    }

    // --- NUEVA LÓGICA DE TRACKING ESTABLE DE 6 CARAS ---
    const caras = [
        { el: document.getElementById("cara-superior"),  rot: {x: 0, y: 0, z: 0} },       
        { el: document.getElementById("cara-frontal"),   rot: {x: 90, y: 0, z: 0} },      
        { el: document.getElementById("cara-derecha"),   rot: {x: 0, y: 0, z: -90} },     
        { el: document.getElementById("cara-izquierda"), rot: {x: 0, y: 0, z: 90} },      
        { el: document.getElementById("cara-trasera"),   rot: {x: -90, y: 0, z: 180} },   
        { el: document.getElementById("cara-inferior"),  rot: {x: 180, y: 0, z: 0} }      
    ];

    caras.forEach((cara) => {
        if (cara.el) {
            cara.el.addEventListener("targetFound", () => {
                // Guardamos una bandera de que el tracking está activo
                contenedor.setAttribute("data-tracking-active", "true");

                // En lugar de mover el objeto dentro de la cara, copiamos la posición 3D
                // que MindAR calcula en tiempo real para esa cara
                const posicionCara = cara.el.object3D.position;
                const rotacionCara = cara.el.object3D.rotation;

                // Aplicamos la posición de la cara al contenedor maestro
                contenedor.object3D.position.copy(posicionCara);
                
                // Aplicamos la rotación combinando el giro del cubo con el ajuste de la cara
                contenedor.object3D.rotation.copy(rotacionCara);
                
                // Rotación de compensación para que mire hacia arriba
                visor.object3D.rotation.set(
                    THREE.MathUtils.degToRad(cara.rot.x),
                    THREE.MathUtils.degToRad(cara.rot.y),
                    THREE.MathUtils.degToRad(cara.rot.z)
                );

                // Si el usuario ya cargó el GLB, lo hacemos visible inmediatamente
                if (modeloCargado) {
                    contenedor.setAttribute("visible", true);
                }
            });

            // Actualización continua mientras se mantenga el tracking de la cara
            cara.el.addEventListener("targetLost", () => {
                // No ocultamos el objeto inmediatamente para evitar parpadeos molestos
                // al pasar de una cara a otra rápido.
            });
        }
    });

    // Actualización de coordenadas en cada fotograma para que siga el movimiento de la mano
    // sin alterar la estructura del árbol de HTML
    setInterval(() => {
        caras.forEach((cara) => {
            if (cara.el && cara.el.object3D.visible && modeloCargado) {
                contenedor.object3D.position.copy(cara.el.object3D.position);
                contenedor.object3D.quaternion.copy(cara.el.object3D.quaternion);
            }
        });
    }, 1000 / 60); // Ejecución a 60 FPS para máxima suavidad
});
