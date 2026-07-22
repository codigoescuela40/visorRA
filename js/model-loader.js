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

    const modelo = e.detail.model;

    let cajaGlobal = new THREE.Box3();
    let primera = true;

    modelo.traverse((obj) => {

        if (!obj.isMesh || !obj.geometry) return;

        obj.geometry.computeBoundingBox();

        const caja = obj.geometry.boundingBox.clone();

        const tamaño = new THREE.Vector3();
        caja.getSize(tamaño);
        
        console.log("---------------------");
        console.log("Nombre:", obj.name);
        console.log("Tamaño:", tamaño);

        if (primera) {
            cajaGlobal.copy(caja);
            primera = false;
        } else {
            cajaGlobal.union(caja);
        }

    });

    console.log("===============");
    console.log("CAJA GLOBAL");
    console.log(cajaGlobal);

    const tamaño = new THREE.Vector3();
    cajaGlobal.getSize(tamaño);

    console.log("Tamaño global:", tamaño);

    const mayor = Math.max(tamaño.x, tamaño.y, tamaño.z);

    console.log("Lado mayor:", mayor);

}, { once: true });

        });

    }

};
