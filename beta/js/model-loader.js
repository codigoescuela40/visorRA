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
  
              // Sólo calculamos una vez
              if (indice !== 0) return;
  
              const modelo = e.detail.model;
  
              let cajaGlobal = new THREE.Box3();
              let primera = true;
  
              modelo.updateMatrixWorld(true);
  
              modelo.traverse((obj) => {
  
                  if (!obj.isMesh || !obj.geometry) return;
  
                  obj.geometry.computeBoundingBox();
  
                  const caja = obj.geometry.boundingBox.clone();
  
                  // MUY IMPORTANTE:
                  // Convertimos la caja local a coordenadas mundiales
                  caja.applyMatrix4(obj.matrixWorld);
  
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
  
              console.log("Centro GLB:", centroGLB);
              console.log("Tamaño GLB:", tamaño);
  
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

      const caja = geometry.boundingBox;

      const tamaño = new THREE.Vector3();
      caja.getSize(tamaño);

      const centroSTL = new THREE.Vector3();
      caja.getCenter(centroSTL);

      console.log("Caja STL:", caja);
      console.log("Centro STL:", centroSTL);
      console.log("Tamaño STL:", tamaño);

      const mayor = Math.max(
        tamaño.x,
        tamaño.y,
        tamaño.z
      );

      console.log("Lado mayor STL:", mayor);

      const TAMAÑO_OBJETIVO = 0.8;
      const escalaCalculada = TAMAÑO_OBJETIVO / mayor;

      console.log("Escala STL:", escalaCalculada);
geometry.computeVertexNormals();
const material = new THREE.MeshPhongMaterial({
    color: 0xbdbdbd,
    shininess: 35,
    specular: 0x333333,
    side: THREE.DoubleSide
});

      visores.forEach((visor) => {
        visor.removeObject3D("mesh");

        const mesh = new THREE.Mesh(geometry, material);
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
  },
};
