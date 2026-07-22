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
                console.log("Modelo GLB cargado");
            }, { once: true });

        });

    }

};
