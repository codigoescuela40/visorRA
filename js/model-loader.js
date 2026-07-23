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

                // Solo calculamos una vez
                if (indice !== 0) return;

                const modelo = e.detail.model;

                // ----------------------------------------------------
                // BoundingBox REAL del modelo
                // ----------------------------------------------------
                const caja = new THREE.Box3().setFromObject(modelo);

                const tamaño = new THREE.Vector3();
                caja.getSize(tamaño);

                const centro = new THREE.Vector3();
                caja.getCenter(centro);

                console.log("=== BOX3 OFICIAL ===");
                console.log("Centro:", centro);
                console.log("Tamaño:", tamaño);

                // ----------------------------------------------------
                // Centrado automático
                // ----------------------------------------------------
                modelo.position.sub(centro);

                console.log("Nueva posición:", modelo.position);

                // ----------------------------------------------------
                // Autoescalado
                // ----------------------------------------------------
                const mayor = Math.max(
                    tamaño.x,
                    tamaño.y,
                    tamaño.z
                );

                console.log("Lado mayor:", mayor);

                const TAMAÑO_OBJETIVO = 0.8;

                const escalaCalculada =
                    TAMAÑO_OBJETIVO / mayor;

                console.log("Escala calculada:", escalaCalculada);

                visores.forEach(v => {

                    v.setAttribute(
                        "scale",
                        `${escalaCalculada} ${escalaCalculada} ${escalaCalculada}`
                    );

                });

                if (onEscalaCalculada) {
                    onEscalaCalculada(escalaCalculada);
                }

            }, { once: true });

        });

    },

    cargarSTL(url, visores, escalaInicial, onEscalaCalculada) {

        const loader = new THREE.STLLoader();

        loader.load(url, (geometry) => {

            console.log("STL cargado");

            geometry.computeBoundingBox();
            geometry.computeVertexNormals();
            geometry.normalizeNormals();

            const caja = geometry.boundingBox;

            const tamaño = new THREE.Vector3();
            caja.getSize(tamaño);

            const centro = new THREE.Vector3();
            caja.getCenter(centro);

            console.log("Caja STL:", caja);
            console.log("Centro STL:", centro);
            console.log("Tamaño STL:", tamaño);

            const mayor = Math.max(
                tamaño.x,
                tamaño.y,
                tamaño.z
            );

            console.log("Lado mayor STL:", mayor);

            const TAMAÑO_OBJETIVO = 0.8;

            const escalaCalculada =
                TAMAÑO_OBJETIVO / mayor;

            console.log("Escala STL:", escalaCalculada);

            const material = new THREE.MeshPhongMaterial({
                color: 0xbdbdbd,
                shininess: 25,
                specular: 0x555555
            });

            visores.forEach((visor) => {

                visor.removeObject3D("mesh");

                const mesh = new THREE.Mesh(
                    geometry,
                    material
                );

                mesh.rotation.x = -Math.PI / 2;

                // -----------------------------
                // CENTRADO AUTOMÁTICO STL
                // -----------------------------
                mesh.position.set(
                    -centro.x,
                    -centro.y,
                    -centro.z
                );

                visor.setObject3D("mesh", mesh);

                visor.setAttribute(
                    "scale",
                    `${escalaCalculada} ${escalaCalculada} ${escalaCalculada}`
                );

                visor.setAttribute("visible", true);

            });

            if (onEscalaCalculada) {
                onEscalaCalculada(escalaCalculada);
            }

        });

    }

};
