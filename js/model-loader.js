window.ModelLoader = {
    procesarModelo(modelo, visores, onEscalaCalculada) {
    
        const cajaGlobal = new THREE.Box3().setFromObject(modelo);
    
        console.log("==========");
        console.log("CAJA GLOBAL");
        console.log(cajaGlobal);
    
        const tamaño = new THREE.Vector3();
        cajaGlobal.getSize(tamaño);
    
        console.log("Tamaño:", tamaño);
    
        const centro = new THREE.Vector3();
        cajaGlobal.getCenter(centro);
    
        console.log("Centro:", centro);
    
        const mayor = Math.max(
            tamaño.x,
            tamaño.y,
            tamaño.z
        );
    
        console.log("Lado mayor:", mayor);
    
        const TAMAÑO_OBJETIVO = 0.8;
    
        const escalaCalculada = TAMAÑO_OBJETIVO / mayor;
    
        console.log("Escala:", escalaCalculada);
    
        if (onEscalaCalculada) {
            onEscalaCalculada(escalaCalculada);
        }
    
    }
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
                
                ModelLoader.procesarModelo(
                    modelo,
                    visores,
                    (escalaCalculada) => {
                        visores.forEach(v => {
                            v.setAttribute(
                                "scale",
                                `${escalaCalculada} ${escalaCalculada} ${escalaCalculada}`
                            );
                        });
                        if (onEscalaCalculada) {
                            onEscalaCalculada(escalaCalculada);
                        }
                    }
                );
            }, { once:true });

        });

    }

};
