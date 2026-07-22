window.ModelLoader = {

    cargarGLB(url, visores, escala) {

        visores.forEach((visor) => {

            // Limpiar cualquier modelo anterior
            visor.removeAttribute("gltf-model");
            visor.removeObject3D("mesh");

            visor.setAttribute("gltf-model", url);
            visor.setAttribute("scale", `${escala} ${escala} ${escala}`);
            visor.setAttribute("visible", true);

            visor.addEventListener("model-loaded", () => {
            
                const modelo = visor.getObject3D("mesh");
            
                if (!modelo) {
                    console.log("No se encontró el modelo");
                    return;
                }
            
                const caja = new THREE.Box3().setFromObject(modelo);
            
                const tamaño = new THREE.Vector3();
                caja.getSize(tamaño);
            
                const mayor = Math.max(tamaño.x, tamaño.y, tamaño.z);
            
                console.log("Tamaño del modelo:", tamaño);
                console.log("Lado mayor:", mayor);
            
            }, { once: true });

        });

    }

};
