import { Scene, SphereGeometry, MeshBasicMaterial, Points, PointsMaterial, TextureLoader, AdditiveBlending, BufferAttribute, BufferGeometry, AxesHelper, Vector3 } from 'three';
import Renderer from './Renderer';
import Camera from './Camera';
import fire from "./images/fire.png"

export default class Laser {
    constructor(scene, player) {

        this.scene = scene;
        this.player = player

        var vector = new Vector3(0, 1, 0)
        var rayvector = new Vector3();
        var start = player.position.clone()
        var stop = player.getWorldDirection(rayvector).multiplyScalar(1).applyAxisAngle(vector, Math.PI / 2)

        this.particlesCount = 150
        this.v1 = start
        this.v2 = stop
        this.subV = this.v2.clone().sub(this.v1.clone())
        this.stepV = this.subV.divideScalar(this.particlesCount)

        this.particlesGeometry = new BufferGeometry()
        this.verticesArray = new Float32Array(this.particlesCount * 3 + 3)
        for (let i = 0; i < (this.particlesCount * 3) + 3; i += 3) {
            let tmp = (i / 3) + 1
            this.verticesArray[i] = (this.v1.x - 5) + this.stepV.x * tmp;
            this.verticesArray[i + 1] = (this.v1.y - 5) + this.stepV.y * tmp;
            this.verticesArray[i + 2] = (this.v1.z - 5) + this.stepV.z * tmp;
        }

        this.particlesGeometry.setAttribute("position", new BufferAttribute(this.verticesArray, 3))
        this.particleMaterial = new PointsMaterial({
            color: 0x33ccff,
            depthWrite: false,
            transparent: true,
            size: 0.06,
            opacity: 0.7,
            map: new TextureLoader().load(fire),
            blending: AdditiveBlending
        })

        this.mesh = new Points(this.particlesGeometry, this.particleMaterial)
    }
    render() {
        var size = document.getElementById("skala").value / 4 + 10
        var dis = document.getElementById("roz").value / 4 + 10

        var vector = new Vector3(0, 1, 0)
        var rayvector = new Vector3();
        var direction = this.player.getWorldDirection(rayvector).multiplyScalar(1).applyAxisAngle(vector, Math.PI / 2)

        var start = this.player.position.clone()
        start.x = start.x + (direction.x * 20)
        start.z = start.z + (direction.z * 20)

        var stop = this.v1.clone()
        stop.x = stop.x + (direction.x * 150)
        stop.z = stop.z + (direction.z * 150)

        this.v1 = start
        this.v2 = stop
        this.subV = this.v2.clone().sub(this.v1.clone())
        this.stepV = this.subV.divideScalar(this.particlesCount)

        this.particleMaterial.size = size
        let positions = this.particlesGeometry.attributes.position.array

        for (let i = 0; i < (positions.length * 3) + 3; i += 3) {
            var random = Math.floor(Math.random() * 3) + 50

            this.verticesArray[i] = (this.v1.x - 5) + this.subV.x * ((i / 3) + 1) + (Math.random() * dis) - dis / 2;
            this.verticesArray[i + 1] = random;
            this.verticesArray[i + 2] = (this.v1.z - 5) + this.subV.z * ((i / 3) + 1) + (Math.random() * dis) - dis / 2;;
        }

        this.particlesGeometry.attributes.position.needsUpdate = true
    }
    add() {
        this.scene.add(this.mesh)
    }
    remove() {
        this.scene.remove(this.mesh)
    }
}