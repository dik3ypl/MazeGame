import { Object3D, SpriteMaterial, TextureLoader, AdditiveBlending, PointLight } from "three"
import fire from "./images/fire.png"
import Particle from "./Particle"

export default class Fireplace extends Object3D {

    constructor() {
        super()
        this.particles = []
        this.count = 100

        this.material = new SpriteMaterial({
            color: 0xFF4500,
            map: new TextureLoader().load(fire),
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: AdditiveBlending
        });


        this.init()
    }

    init() {

        for (let i = 0; i < this.count; i++) {
            let particle = new Particle(this.material, i)
            this.add(particle)
            this.particles.push(particle);
        }
    }

    update(value, value2, value3) {
        this.particles.forEach(particle => {
            particle.update(value, value2, value3)
        })
    }
}