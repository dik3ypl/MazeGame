import { Sprite, Vector3 } from "three"

export default class Particle2 extends Sprite {
    constructor(material, y) {
        super()

        this.material = material.clone()
        this.scale.set(
            Math.random() * 30,
            Math.random() * 30,
            Math.random() * 30
        );

        this.position.y = 10 + (y / 4)
    }

    update(value, value2) {
        this.scale.set(
            Math.random() * value + value2,
            Math.random() * value,
            Math.random() * value
        );
    }
}