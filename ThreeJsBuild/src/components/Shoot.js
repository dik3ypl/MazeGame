import { Object3D, SpriteMaterial, TextureLoader, AdditiveBlending, PointLight } from "three"
import fire from "./images/fire.png"
import Particle2 from "./Particle2"

export default class Shoot extends Object3D {

    constructor() {
        super()
        this.particles = []
        this.count = 100
        this.dead = false

        this.material = new SpriteMaterial({
            color: 0x808080,
            map: new TextureLoader().load(fire),
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: AdditiveBlending,
        });


        this.init()
    }

    init() {

        for (let i = 0; i < this.count; i++) {
            let particle = new Particle2(this.material, i)
            this.add(particle)
            this.particles.push(particle);
        }
    }

    update(value, value2) {
        this.particles.forEach(particle => {
            particle.update(value, value2)
        })
    }
}