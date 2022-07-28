import Renderer from './Renderer';
import Camera from './Camera';
import Model from "./Model"
import Keyboard from "./Keyboard"
import Animation from "./Animation"
import Config from './Config';
import Floor from './Floor';
import Board from './Board';
import Shoot from './Shoot';
import Background from './Background';
import Laser from './Laser';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import player from "./models/unit02/tris.md2"

import {
    BoxGeometry,
    LinePhongMaterial,
    Line,
    LoadingManager,
    Clock,
    Vector3,
    GridHelper,
    AmbientLight,
    Ray,
    Raycaster,
    Box3,
    AxesHelper,
    Scene,
    Mesh,
    MeshBasicMaterial
} from 'three';

export default class Main {
    constructor(container, level) {
        this.minus = 60
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(this.scene, container);
        this.camera = new Camera(this.renderer.threeRenderer);
        this.raycaster = new Raycaster()
        this.distance = null
        this.distance2 = null
        this.canWin = true
        this.continue = false

        new Background(this.scene)
        new Floor(this.scene, level.size)
        this.board = new Board(this.scene, level.list, level.size)
        this.ambient = new AmbientLight(0xffffff, 0.1);
        this.scene.add(this.ambient);

        /* STATIC INPUT AND RANGES - FULL CONSOLE OPTIONS */
        document.getElementById("cienie").addEventListener("change", (e) => {
            this.renderer.threeRenderer.shadowMap.enabled = e.target.checked
            this.scene.traverse(function (child) {
                if (child.material) {
                    child.material.needsUpdate = true
                }
            })
        })
        /* END CONSOLE OPTIONS */

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb

        document.body.appendChild(this.stats.dom);

        // zegar - vide lekcja 4

        this.clock = new Clock()

        // manager loadingu, pozwala monitorować progress oraz fakt zakończenia ładowania

        this.manager = new LoadingManager();

        // this.manager.onProgress = (item, loaded, total) => {
        //     console.log(`progress ${item}: ${loaded} ${total}`);
        // };

        this.model = new Model(this.scene, this.manager);
        this.model.load(player);

        this.manager.onLoad = () => {

            this.isLoaded = true;

            this.animation = new Animation(this.model.mesh)

            var x; var z
            for (let i = 0; i < level.size; i++) {
                var position = true;
                for (let k = 0; k < level.list.length; k++) {
                    if (i == level.list[k].id) position = false
                }
                if (position == true) {
                    x = Math.floor(i / 10) - 5
                    z = i % 10 - 5
                }
            }

            this.model.mesh.position.x = x * 150
            this.model.mesh.position.y = 35
            this.model.mesh.position.z = z * 150
            this.model.mesh.lookAt(new Vector3(0, 35, 0))

            this.laser = new Laser(this.scene, this.model.mesh)
            this.laser.stop = new Vector3(200, 200, 200)

            this.box3 = new Box3()
            this.model.geometry.computeBoundingBox()

            this.animation.playAnim("1stand")

            this.keyboard = new Keyboard(window, this.animation, this.model.mesh);
        }

        this.render();
    }

    render() {
        this.stats.begin()

        var delta = this.clock.getDelta();
        if (this.animation) this.animation.update(delta)

        this.renderer.render(this.scene, this.camera.threeCamera);

        this.board.firePlaces.forEach(fireplace => {
            fireplace.update(document.getElementById("value").value, document.getElementById("value2").value, document.getElementById("value3").value)
        })

        this.board.lights.forEach(light => {
            light.intensity = document.getElementById("light").value / 100
        })

        if (this.model.mesh) {
            if (Config.rotateLeft) {
                this.model.mesh.rotation.y += 0.05
            }
            if (Config.rotateRight) {
                this.model.mesh.rotation.y -= 0.05
            }
            if (Config.moveForward && this.distance > 50) {
                if (Config.sprint) this.model.mesh.translateX(3)
                this.model.mesh.translateX(3)
            }
            if (Config.moveBack && this.distance2 > 50) {
                this.model.mesh.translateX(-1)
            }

            if (Config.space) {
                this.laser.add()
            } else {
                this.laser.remove()
            }


            /* DYNAMIC INPUT AND RANGES - FULL CONSOLE OPTIONS */
            if (document.getElementById("up").checked == false) {
                this.camera = new Camera(this.renderer.threeRenderer, document.getElementById("fov").value);
                const camVect = new Vector3(-200 - document.getElementById("distance").value * 4, 50, 0)
                const camPos = camVect.applyMatrix4(this.model.mesh.matrixWorld);
                this.camera.threeCamera.position.x = camPos.x
                this.camera.threeCamera.position.y = camPos.y + document.getElementById("y").value * 4
                this.camera.threeCamera.position.z = camPos.z

                var position = this.model.mesh.position.clone()
                position.y += (document.getElementById("nachylenie").value * 10)
                this.camera.threeCamera.lookAt(position)
                this.camera.threeCamera.fov = 600
            } else {
                this.camera.threeCamera.position.set(0, 1500, 0)
                this.camera.threeCamera.lookAt(0, 0, 0)
            }
            /* END CONSOLE OPTIONS */
        }

        if (this.board.boolean && this.isLoaded) {
            this.laser.render()
            for (let i = 0; i < this.board.enemies.length; i++) {
                this.board.enemies[i].mesh.lookAt(this.model.mesh.position)
                if (this.board.enemies[i].mesh.position.z > this.model.mesh.position.z) this.board.enemies[i].mesh.rotation.y += Math.PI / 2
                else this.board.enemies[i].mesh.rotation.y -= Math.PI / 2

                this.board.animations[i].update(delta)
            }

            this.board.actualize()
            for (let i = 0; i < this.board.boxes3.length; i++) {
                var contact = this.board.boxes3[i][0].intersectsBox(this.box3)

                if (contact) {
                    this.board.boxes3[i][1].anim(this.model.mesh)
                    if (this.board.boxes3[i][2] == false) {
                        this.board.boxes3[i][2] = true
                        this.board.boxes3[i][1].add()

                        this.board.animations[i].playAnim('attack')
                    }
                } else {
                    if (this.board.boxes3[i][2] == true) {
                        this.board.boxes3[i][2] = false
                        this.board.boxes3[i][1].remove()

                        this.board.animations[i].playAnim('crstnd')
                    }
                }

                this.board.boxes3[i][1].shoot.update(document.getElementById("skala").value / 2, document.getElementById("roz").value / 2)
            }
        }

        if (this.isLoaded == true) {
            this.box3.copy(this.model.mesh.geometry.boundingBox).applyMatrix4(this.model.mesh.matrixWorld);

            {
                var vector = new Vector3(0, 1, 0)
                var rayvector = new Vector3();
                var ray = new Ray(this.model.mesh.position, this.model.mesh.getWorldDirection(rayvector).multiplyScalar(1).applyAxisAngle(vector, Math.PI / 2))
                this.raycaster.ray = ray
                var intersects = this.raycaster.intersectObjects(this.board.walls);
                this.distance = intersects[0].distance
            }

            {
                var vector = new Vector3(0, -1, 0)
                var rayvector = new Vector3();
                var ray = new Ray(this.model.mesh.position, this.model.mesh.getWorldDirection(rayvector).multiplyScalar(1).applyAxisAngle(vector, Math.PI / 2))
                this.raycaster.ray = ray
                var intersects = this.raycaster.intersectObjects(this.board.walls);
                this.distance2 = intersects[0].distance
            }

            {
                var vector = new Vector3(0, 1, 0)
                var rayvector = new Vector3();
                var ray = new Ray(this.model.mesh.position, this.model.mesh.getWorldDirection(rayvector).multiplyScalar(1).applyAxisAngle(vector, Math.PI / 2))
                this.raycaster.ray = ray
                var intersects = this.raycaster.intersectObjects(this.board.enemiesIntersect);
                if (intersects[0] && Config.space && intersects[0].distance < 135) {
                    var newEI = []
                    for (let i = 0; i < this.board.boxes3.length; i++) {
                        if (this.board.boxes3[i][1].mesh == intersects[0].object) {
                            if (this.board.boxes3[i][1].shoot.dead == false)
                                document.getElementById("points").innerText = parseInt(document.getElementById("points").innerText) + 10

                            this.scene.remove(this.board.boxes3[i][1].mesh)
                            this.scene.remove(this.board.boxes3[i][1].shoot)
                            this.board.boxes3[i][1].shoot.dead = true
                        }
                    }
                    for (let i = 0; i < this.board.enemiesIntersect.length; i++) {
                        if (this.board.enemiesIntersect[i] != intersects[0].object) newEI.push(this.board.enemiesIntersect[i])
                    }
                    this.board.enemiesIntersect = newEI

                    if (this.board.enemiesIntersect.length == 0 && this.board.treasures.length == 0 && this.continue == false && this.canWin == true) {
                        this.continue = true
                        Config.space = false

                        setTimeout(function () {
                            var action = confirm("Nice! You won, congratulations.\n\nSave score?")

                            if (action == 1) {
                                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

                                var nick = prompt("What's your nick?")
                                var score = document.getElementById("points").innerText
                                var date = new Date()
                                var day = `${date.getDay()} ${months[date.getMonth()]} ${date.getFullYear()}`
                                var hour = `${date.getHours()}:${date.getMinutes()}`

                                const body = JSON.stringify({ nick: nick, score: score, date: day, hour: hour })
                                const header = { "Contet-Type": "application/json", "Access-Control-Allow-Origin": "*" }

                                fetch("https://boletus-revenge.herokuapp.com/score", { method: "post", body, header })
                            }

                            var action = confirm("Do you want to continue?")

                            if (action == 0) {
                                var quit = document.createElement("a")
                                quit.setAttribute("href", "/")
                                document.body.appendChild(quit)
                                quit.click()
                            }
                        }, 100)
                    }
                }
            }

            {
                for (let i = 0; i < this.board.treasures.length; i++) {
                    var x = Math.abs(this.model.mesh.position.x - this.board.treasures[i].position.x)
                    var z = Math.abs(this.model.mesh.position.z - this.board.treasures[i].position.z)

                    var newT = []
                    if (x < 50 && z < 50) {
                        this.scene.remove(this.board.treasures[i])
                        document.getElementById("points").innerText = parseInt(document.getElementById("points").innerText) + 100
                    } else newT.push(this.board.treasures[i])

                    this.board.treasures = newT

                    if (this.board.enemiesIntersect.length == 0 && this.board.treasures.length == 0 && this.continue == false && this.canWin == true) {
                        this.continue = true

                        setTimeout(function () {
                            var action = confirm("Nice! You won, congratulations.\n\nSave score?")

                            if (action == 1) {
                                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

                                var nick = prompt("What's your nick?")
                                var score = document.getElementById("points").innerText
                                var date = new Date()
                                var day = `${date.getDay()} ${months[date.getMonth()]} ${date.getFullYear()}`
                                var hour = `${date.getHours()}:${date.getMinutes()}`

                                const body = JSON.stringify({ nick: nick, score: score, date: day, hour: hour })
                                const header = { "Contet-Type": "application/json", "Access-Control-Allow-Origin": "*" }

                                fetch("https://boletus-revenge.herokuapp.com/score", { method: "post", body, header })
                            }

                            var action = confirm("Do you want to continue?")

                            if (action == 0) {
                                var quit = document.createElement("a")
                                quit.setAttribute("href", "/")
                                document.body.appendChild(quit)
                                quit.click()
                            }
                        }, 100)
                    }
                }
            }
        }

        this.minus -= 1
        if (this.minus == 0) {
            this.minus = 60

            document.getElementById("points").innerText = parseInt(document.getElementById("points").innerText) - 1
        }

        if (this.board.getters == 0) this.continue = true

        if (document.getElementById("points").innerText < 0 && this.continue == false) {
            this.continue = true
            this.canWin = false

            var action = confirm("Unlucky! You lose.\n\nDo you want continue without saving score?")

            if (action == 0) {
                var quit = document.createElement("a")
                quit.setAttribute("href", "/")
                document.body.appendChild(quit)
                quit.click()
            }
        }


        this.stats.end()
        this.renderer.render(this.scene, this.camera.threeCamera);

        requestAnimationFrame(this.render.bind(this));
    }
}