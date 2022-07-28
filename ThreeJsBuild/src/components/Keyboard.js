import Animation from "./Animation"
import Config from "./Config";

const KEYS = {
    "left": 65,
    "up": 87,
    "right": 68,
    "down": 83,
    "shift": 16,
    "space": 32
};

export default class Keyboard {
    constructor(domElement, animation, modelMesh) {

        this.domElement = domElement;
        this.animation = animation
        this.modelMesh = modelMesh

        this.domElement.addEventListener('keydown', event => this.onKeyDown(event), false);
        this.domElement.addEventListener('keyup', event => this.onKeyUp(event), false);
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case KEYS.up:
                Config.moveForward = false;
                this.animation.playAnim("1stand")
                break;
            case KEYS.left:
                Config.rotateLeft = false;
                break;
            case KEYS.right:
                Config.rotateRight = false;
                break;
            case KEYS.down:
                Config.moveBack = false;
                this.animation.playAnim("1stand")
                break;
            case KEYS.shift:
                Config.sprint = false;
                break;
            case KEYS.space:
                Config.space = false;
                break;
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case KEYS.up:
                this.animation.stopAnim("1stand")
                this.animation.playAnim("2run")
                Config.moveForward = true;
                break;
            case KEYS.left:
                Config.rotateLeft = true;
                break;
            case KEYS.right:
                Config.rotateRight = true;
                break;
            case KEYS.down:
                this.animation.stopAnim("1stand")
                this.animation.playAnim("cr2run")
                Config.moveBack = true;
                break;
            case KEYS.shift:
                Config.sprint = true;
                break;
            case KEYS.space:
                Config.space = true;
                break;
        }
    }
}