window.ModelLoader = {

    cargarGLB(url, visores, escala) {

        visores.forEach((visor) => {

            // Limpiar cualquier modelo anterior
            visor.removeAttribute("gltf-model");
            visor.removeObject3D("mesh");

            visor.setAttribute("gltf-model", url);
            visor.setAttribute("scale", `${escala} ${escala} ${escala}`);
            visor.setAttribute("visible", true);

visor.addEventListener("model-loaded", (e) => {

    console.log("==============");
    console.log("MODEL LOADED");
    console.log("==============");

    console.log("e.detail.model:");
    console.log(e.detail.model);

    console.log("visor.object3D:");
    console.log(visor.object3D);

    console.log("getObject3D('mesh'):");
    console.log(visor.getObject3D("mesh"));

    const modelo = e.detail.model;

    console.log("Recorrido completo del modelo:");

    modelo.traverse((obj) => {

        console.log("----------------");
        console.log("Nombre:", obj.name);
        console.log("Tipo:", obj.type);
        console.log("isMesh:", obj.isMesh);

        if (obj.isMesh) {

            console.log("Geometría:", obj.geometry);

            const pos = obj.geometry.getAttribute("position");

            console.log("Atributo POSITION:", pos);

            if (pos) {
                console.log("Vertices:", pos.count);
            }

            console.log("BoundingBox:", obj.geometry.boundingBox);
            console.log("BoundingSphere:", obj.geometry.boundingSphere);

            obj.geometry.computeBoundingBox();
            obj.geometry.computeBoundingSphere();

            console.log("BoundingBox calculada:", obj.geometry.boundingBox);
            console.log("BoundingSphere calculada:", obj.geometry.boundingSphere);

        }

    });

    console.log("====== BOX3 ======");

    const caja = new THREE.Box3();

    caja.setFromObject(modelo);

    console.log(caja);

    console.log("min:", caja.min);
    console.log("max:", caja.max);

    const tamaño = new THREE.Vector3();

    caja.getSize(tamaño);

    console.log("Tamaño:", tamaño);

}, { once: true });

        });

    }

};
