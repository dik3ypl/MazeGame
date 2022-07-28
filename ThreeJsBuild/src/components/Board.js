import { PlaneGeometry, MeshPhongMaterial, TextureLoader, Mesh, DoubleSide, BoxGeometry, PointLight, LoadingManager, Vector3, MeshBasicMaterial, Box3 } from 'three';
import Fireplace from './Fireplace'
import Enemy from './Enemy'
import Animation from './Animation'
import wood from './images/wood.png'
import diamond from './images/diamond.png'
import enemy from "./models/hd/TRIS.md2"

export default class Board {
    constructor(scene, list, size) {
        this.firePlaces = []
        this.walls = []
        this.enemies = []
        this.treasures = []
        this.enemiesIntersect = []
        this.boolean = false
        this.animations = []
        this.boxes3 = []
        this.getters = 0
        this.lights = []

        this.playbox = new BoxGeometry(size / 10 * 150, 100000, size / 10 * 150, 1, 1, 1);
        this.border = new Mesh(this.playbox, new MeshBasicMaterial({ side: DoubleSide, wireframe: true, color: 0x000000, transparent: true, opacity: 0.001 }))
        this.border.position.set(-75, 0, -75)
        this.walls.push(this.border)
        scene.add(this.border)

        for (let i = 0; i < list.length; i++) {
            var x = Math.floor(list[i].id / 10) - 5
            var z = list[i].id % 10 - 5

            if (list[i].type == "wall") {
                var geometry = new BoxGeometry(150, 150, 150);
                var material = new MeshPhongMaterial({
                    map: new TextureLoader().load(wood),
                    transparent: true,
                })
                var cube = new Mesh(geometry, material);

                cube.position.x = x * 150
                cube.position.y = 50
                cube.position.z = z * 150

                cube.castShadow = true
                cube.receiveShadow = true

                this.walls.push(cube)

                scene.add(cube);
            }
            if (list[i].type == "treasure") {
                var geometry = new BoxGeometry(50, 50, 50);
                var material = new MeshPhongMaterial({
                    side: DoubleSide,
                    map: new TextureLoader().load(diamond),
                    transparent: true,
                })
                var cube = new Mesh(geometry, material);

                this.getters += 1

                cube.position.x = x * 150
                cube.position.y = 0
                cube.position.z = z * 150

                this.treasures.push(cube)

                cube.castShadow = true

                scene.add(cube);
            }
            if (list[i].type == "light") {
                let fire = new Fireplace()
                scene.add(fire)
                fire.position.x = x * 150
                fire.position.y = -20
                fire.position.z = z * 150

                this.firePlaces.push(fire)

                let point = new PointLight(0xffffff, 0.5)
                point.castShadow = true
                scene.add(point)
                this.lights.push(point)
                point.position.x = x * 150
                point.position.y = 50
                point.position.z = z * 150
            }
            if (list[i].type == "enemy") {
                let manager = new LoadingManager();
                let model = new Enemy(scene, manager, x, z);
                model.load(enemy);
                this.enemies.push(model)

                this.getters += 1

                manager.onLoad = () => {
                    this.boolean = true

                    for (let k = 0; k < this.enemies.length; k++) {
                        var anim = new Animation(this.enemies[k].mesh)
                        anim.playAnim('crstnd')
                        this.animations.push(anim)

                        this.enemiesIntersect.push(this.enemies[k].mesh)

                        var box3 = new Box3()
                        this.enemies[k].geometry.computeBoundingBox()
                        box3.copy(this.enemies[k].mesh.geometry.boundingBox).applyMatrix4(this.enemies[k].mesh.matrixWorld);
                        this.boxes3.push([box3, this.enemies[k], false])
                    }
                }
            }
            if (i == list.length - 1 && this.enemies.length == 0) {
                this.boolean = true
            }
        }
    }

    actualize() {
        for (let k = 0; k < this.boxes3.length; k++) {

            this.boxes3[k][0].copy(this.enemies[k].mesh.geometry.boundingBox).applyMatrix4(this.enemies[k].mesh.matrixWorld);
        }
    }
}