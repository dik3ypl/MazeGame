import { MD2Loader } from 'three/examples/jsm/loaders/MD2Loader.js';
import { Mesh, TextureLoader, MeshPhongMaterial, Vector3 } from "three"
import Animation from './Animation'
import Shoot from './Shoot'
import enemy from "./models/hd/two.jpg"

export default class Enemy {
    constructor(scene, manager, x, z) {
        this.scene = scene;
        this.mesh = null;
        this.manager = manager;
        this.geometry = null
        this.x = x
        this.z = z
    }

    load(path) {
        new MD2Loader(this.manager).load(
            path,
            geometry => {

                this.geometry = geometry;

                this.mesh = new Mesh(geometry, new MeshPhongMaterial({
                    map: new TextureLoader().load(enemy),
                    morphTargets: true
                }))

                this.mesh.scale.set(2.3, 2.3, 2.3)

                this.scene.add(this.mesh);

                this.mesh.position.x = this.x * 150
                this.mesh.position.y = 35
                this.mesh.position.z = this.z * 150

                this.shoot = new Shoot()
                this.shoot.position.x = this.x * 150
                this.shoot.position.y = 30
                this.shoot.position.z = this.z * 150
            },
        );
    }

    unload() {
        this.scene.remove(this);
    }
    add() {
        if (this.shoot.dead == false) this.scene.add(this.shoot)
    }
    remove() {
        this.scene.remove(this.shoot)
        this.shoot.position.x = this.x * 150
        this.shoot.position.z = this.z * 150
    }
    anim(player) {
        this.shoot.position.x -= (this.shoot.position.x - player.position.x) / 7
        this.shoot.position.z -= (this.shoot.position.z - player.position.z) / 7

        if ((this.shoot.position.z - player.position.z) / 7 < 0.3 && (this.shoot.position.z - player.position.z) / 7 > -0.3) {
            this.shoot.position.x = this.x * 150
            this.shoot.position.z = this.z * 150

            if (this.shoot.dead == false) document.getElementById("points").innerText = parseInt(document.getElementById("points").innerText) - 5
        }
    }
}