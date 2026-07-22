window.ModelLoader = {

    // ==========================================================
    // Calcula tamaño, centro y escala de cualquier Object3D
    // ==========================================================
    procesarModelo(modelo) {

        const caja = new THREE.Box3().setFromObject(modelo);

        const tamaño = new THREE.Vector3();
        caja.getSize(tamaño);

        const centro = new THREE.Vector3();
        caja.getCenter(centro);

        console.log("========== MODELO ==========");
        console.log("BoundingBox:", caja);
        console.log("Tamaño:", tamaño);
        console.log("Centro:", centro);

        const ladoMayor = Math.max(
            tamaño.x,
            tamaño.y,
            tamaño.z
        );

        console.log("Lado mayor:", ladoMayor);

        // Queremos que el modelo mida aprox. 80 cm virtuales
        const TAMAÑO_OBJETIVO = 0.8;

        const escala = TAMAÑO_OBJETIVO / ladoMayor;

        console.log("Escala calculada:", escala);

        return {
            caja,
            tamaño,
            centro,
            escala
        };

    },

    // ==========================================================
    // CARGA GLB
    // ==========================================================
    cargarGLB(url, visores, escalaInicial, onEscalaCalculada) {
        visores.forEach((visor, indice) => {
            visor.removeAttribute("gltf-model");
            visor.setAttribute("gltf-model", url);
            visor.setAttribute(
                "scale",
                `${escalaInicial} ${escalaInicial} ${escalaInicial}`
            );
            visor.setAttribute("visible", true);
            visor.addEventListener("model-loaded", (e) => {
                if (indice !== 0) return;
                const resultado = ModelLoader.procesarModelo(
                    e.detail.model
                );
                visores.forEach(v => {
                    v.setAttribute(
                        "scale",
                        `${resultado.escala} ${resultado.escala} ${resultado.escala}`
                    );
                });
                if (onEscalaCalculada) {
                    onEscalaCalculada(resultado.escala);
                }
            }, { once: true });
        });
    }

};
