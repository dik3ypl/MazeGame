import { Sprite, Vector3 } from "three"

export default class Particle extends Sprite {
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

    update(value, value2, value3) {
        this.position.x = Math.random() * value2
        this.position.z = Math.random() * value3

        this.scale.set(
            Math.random() * value,
            Math.random() * value,
            Math.random() * value
        );

        if (this.position.y > 35) {
            this.position.y = 10;
            this.material.opacity = 1;
        }

        this.material.opacity -= 0.02;
        this.position.y += 0.6
    }
}