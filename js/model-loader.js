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
const cajaThree = new THREE.Box3().setFromObject(modelo);

const tamañoThree = new THREE.Vector3();
cajaThree.getSize(tamañoThree);

const centroThree = new THREE.Vector3();
cajaThree.getCenter(centroThree);

console.log("=== BOX3 OFICIAL ===");
console.log("Centro:", centroThree);
console.log("Tamaño:", tamañoThree);
                
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
                const centroGLB = new THREE.Vector3();
                cajaGlobal.getCenter(centroGLB);

modelo.position.set(
    -centroGLB.x,
    -centroGLB.y,
    -centroGLB.z
);

console.log("Posición aplicada GLB:", modelo.position);

                
                const mayor = Math.max(
                    tamaño.x,
                    tamaño.y,
                    tamaño.z
                );

                console.log("Lado mayor:", mayor);

                // Queremos que el modelo ocupe unos 8 cm virtuales
                const TAMAÑO_OBJETIVO = 0.8;

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
            const centroSTL = new THREE.Vector3();
            caja.getCenter(centroSTL);
            
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
    
const material = new THREE.MeshNormalMaterial();
    
            visores.forEach((visor) => {
    
                visor.removeObject3D("mesh");
    
                const mesh = new THREE.Mesh(
                    geometry,
                    material
                );
                mesh.rotation.x = -Math.PI / 2;
                
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
