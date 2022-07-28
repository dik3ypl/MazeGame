import { MeshBasicMaterial, TextureLoader, Mesh, DoubleSide, BoxGeometry, PointLight } from 'three';
import sky from './images/sky.jpg'
import sky2 from './images/sky2.jpg'
import sky3 from './images/sky3.jpg'
import sky4 from './images/sky4.jpg'

export default class Background {
    constructor(scene) {

        var geometry = new BoxGeometry(5000, 5000, 5000);
        var material = []
        material.push(new MeshBasicMaterial({
            side: DoubleSide,
            map: new TextureLoader().load(sky),
            transparent: true,
        }))
        material.push(new MeshBasicMaterial({
            side: DoubleSide,
            map: new TextureLoader().load(sky),
            transparent: true,
        }))
        material.push(new MeshBasicMaterial({
            side: DoubleSide,
            map: new TextureLoader().load(sky),
            transparent: true,
        }))
        material.push(new MeshBasicMaterial({
            side: DoubleSide,
            map: new TextureLoader().load(sky4),
            transparent: true,
        }))
        material.push(new MeshBasicMaterial({
            side: DoubleSide,
            map: new TextureLoader().load(sky3),
            transparent: true,
        }))
        material.push(new MeshBasicMaterial({
            side: DoubleSide,
            map: new TextureLoader().load(sky2),
            transparent: true,
        }))
        var cube = new Mesh(geometry, material);

        scene.add(cube);
    }
}