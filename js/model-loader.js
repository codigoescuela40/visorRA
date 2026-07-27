window.ModelLoader = {
  //Modificación 27 ---
  modelosGLB: [],
  meshSTL: null,
  //-------------------
  cargarGLB(url, visores, escalaInicial, onEscalaCalculada) {
    this.modelosGLB = [];
    visores.forEach((visor, indice) => {
      visor.removeAttribute("gltf-model");
      visor.setAttribute("gltf-model", url);
      visor.setAttribute(
        "scale",
        `${escalaInicial} ${escalaInicial} ${escalaInicial}`
      );
      visor.setAttribute("visible", true);

      visor.addEventListener(
        "model-loaded",
        (e) => {

          const modelo = e.detail.model;
          this.modelosGLB.push(modelo);
          
          // Sólo el primer visor calcula la escala
          if (indice !== 0) return;
          
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

          const mayor = Math.max(
            tamaño.x,
            tamaño.y,
            tamaño.z
          );

          // Queremos que el modelo ocupe unos 8 cm virtuales
          const TAMAÑO_OBJETIVO = 0.8;
          const escalaCalculada = TAMAÑO_OBJETIVO / mayor;

          // Aplicar la escala a los 6 visores
          visores.forEach((v) => {
            v.setAttribute(
              "scale",
              `${escalaCalculada} ${escalaCalculada} ${escalaCalculada}`
            );
          });

          // Avisar al app.js
          if (onEscalaCalculada) {
            onEscalaCalculada(escalaCalculada);
          }
        },
        { once: true }
      );
    });
  },

  cargarSTL(url, visores, escalaInicial, onEscalaCalculada) {
    const loader = new THREE.STLLoader();

    loader.load(url, (geometry) => {

      geometry.computeBoundingBox();

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

      const TAMAÑO_OBJETIVO = 0.8;
      const escalaCalculada = TAMAÑO_OBJETIVO / mayor;


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

        //Modificación 27 ---
        this.meshSTL = mesh;
        //-------------------

        
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

  cambiarColor(color) {

    // ===== STL =====
    if (this.meshSTL) {
    
        if (color === "original") {
            this.meshSTL.material.color.set("#bdbdbd");
        } else {
            this.meshSTL.material.color.set(color);
        }
    
        this.meshSTL.material.needsUpdate = true;
    }

    // ===== GLB =====
    this.modelosGLB.forEach((modelo) => {
    
        modelo.traverse((obj) => {

        // Guardamos el material original la primera vez
        if (!obj.userData.materialOriginal) {
          obj.userData.materialOriginal = obj.material;
        }

        // Restaurar colores originales
        if (color === "original") {
          //obj.material = obj.userData.materialOriginal;
          return;
        }

        if (!obj.isMesh) return;
        if (!obj.material) return;
        
        if (obj.geometry && obj.geometry.hasAttribute("color")) {
            obj.geometry.deleteAttribute("color");
        }
        
        obj.material.vertexColors = false;
        obj.material.color.set(color);
        obj.material.needsUpdate = true;

      });

    });

  }
  
};
