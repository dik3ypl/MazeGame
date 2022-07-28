import { PlaneGeometry, MeshPhongMaterial, TextureLoader, Mesh, DoubleSide, BoxGeometry, MeshBasicMaterial } from 'three';
import cobble1 from './images/cobble1.png'
import cobble2 from './images/cobble2.png'

export default class Floor {
    constructor(scene, size) {
        for (let i = -size / 20; i < size / 20; i++) {
            for (let k = -size / 20; k < size / 20; k++) {
                var tex
                var random = Math.floor(Math.random() * 2)
                if (random == 1) tex = cobble1
                if (random == 0) tex = cobble2

                this.geometry = new PlaneGeometry(150, 150, 1, 1);
                this.material = new MeshPhongMaterial({
                    map: new TextureLoader().load(tex),
                });
                this.plane = new Mesh(this.geometry, this.material);
                this.plane.rotation.x = -Math.PI / 2

                this.plane.position.x = i * 150
                this.plane.position.y = -25
                this.plane.position.z = k * 150

                this.plane.castShadow = true
                this.plane.receiveShadow = true

                scene.add(this.plane)
            }
        }
    }
}