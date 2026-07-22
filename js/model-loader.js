window.ModelLoader = {

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

                // Sólo calculamos la escala una vez (primer visor)
                if (indice !== 0) return;

                const modelo = e.detail.model;

                let cajaGlobal = new THREE.Box3();
                let primera = true;

                modelo.traverse((obj) => {

                    if (!obj.isMesh || !obj.geometry) return;

                    obj.geometry.computeBoundingBox();

                    const caja = obj.geometry.boundingBox.clone();

                    if (primera) {
                        cajaGlobal.copy(caja);
                        primera = false;
                    } else {
                        cajaGlobal.union(caja);
                    }

                });

                const tamaño = new THREE.Vector3();
                cajaGlobal.getSize(tamaño);

                const mayor = Math.max(
                    tamaño.x,
                    tamaño.y,
                    tamaño.z
                );

                console.log("Lado mayor:", mayor);

                // Queremos que el modelo ocupe unos 8 cm virtuales
                const TAMAÑO_OBJETIVO = 0.08;

                const escalaCalculada =
                    TAMAÑO_OBJETIVO / mayor;

                console.log("Escala calculada:", escalaCalculada);

                // Aplicar la escala a los 6 visores
                visores.forEach(v => {

                    v.setAttribute(
                        "scale",
                        `${escalaCalculada} ${escalaCalculada} ${escalaCalculada}`
                    );

                });

                // Avisar al app.js
                if (onEscalaCalculada) {
                    onEscalaCalculada(escalaCalculada);
                }

            }, { once:true });

        });

    }

};
