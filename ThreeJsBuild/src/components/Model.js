import { MD2Loader } from 'three/examples/jsm/loaders/MD2Loader.js';
import { Mesh, TextureLoader, MeshPhongMaterial, Vector3 } from "three"
import player from "./models/unit02/unit02.jpg"

export default class Model {
    constructor(scene, manager) {
        this.scene = scene;
        this.mesh = null;
        this.manager = manager;
        this.geometry = null
    }

    load(path) {
        new MD2Loader(this.manager).load(
            path,
            geometry => {

                this.geometry = geometry;

                this.mesh = new Mesh(geometry, new MeshPhongMaterial({
                    map: new TextureLoader().load(player),
                    morphTargets: true
                }))

                this.mesh.scale.set(2, 2, 2)

                this.mesh.receiveShadow = true
                this.mesh.castShadow = true

                //console.log(this.geometry.animations)
                this.scene.add(this.mesh);
            },
        );
    }

    unload() {
        this.scene.remove(this.mesh);
    }
}