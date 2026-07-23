window.ModelLoader = {

    aplicarEscala(visores, escala) {

        visores.forEach((visor) => {

            visor.setAttribute(
                "scale",
                `${escala} ${escala} ${escala}`
            );

        });

    },

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

                // Bounding Box del modelo
                const caja = new THREE.Box3().setFromObject(modelo);

                const tamaño = new THREE.Vector3();
                caja.getSize(tamaño);

                const centro = new THREE.Vector3();
                caja.getCenter(centro);

                // Intento de centrado (seguiremos trabajando sobre él)
                modelo.position.sub(centro);

                const mayor = Math.max(
                    tamaño.x,
                    tamaño.y,
                    tamaño.z
                );

                const TAMAÑO_OBJETIVO = 0.8;

                const escalaCalculada =
                    TAMAÑO_OBJETIVO / mayor;

                console.log({
                    tipo: "GLB",
                    centro,
                    tamaño,
                    escala: escalaCalculada
                });

                this.aplicarEscala(
                    visores,
                    escalaCalculada
                );

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

            const mayor = Math.max(
                tamaño.x,
                tamaño.y,
                tamaño.z
            );

            const TAMAÑO_OBJETIVO = 0.8;

            const escalaCalculada =
                TAMAÑO_OBJETIVO / mayor;

            console.log({
                tipo: "STL",
                centro,
                tamaño,
                escala: escalaCalculada
            });

const material = new THREE.MeshBasicMaterial({
    color: 0xff0000
});

            visores.forEach((visor) => {

                visor.removeObject3D("mesh");

                const mesh = new THREE.Mesh(
                    geometry,
                    material
                );

                mesh.rotation.x = -Math.PI / 2;

                mesh.position.set(
                    -centro.x,
                    -centro.y,
                    -centro.z
                );

                visor.setObject3D("mesh", mesh);

                visor.setAttribute("visible", true);

            });

            this.aplicarEscala(
                visores,
                escalaCalculada
            );

            if (onEscalaCalculada) {
                onEscalaCalculada(escalaCalculada);
            }

        });

    }

};
