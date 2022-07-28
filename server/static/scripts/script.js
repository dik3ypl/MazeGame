const start = function () {
    const login = prompt('Type password to edit levels:')
    const headers = { "Content-Type": "application/json" }
    const body = JSON.stringify({ login: login })
    fetch('/login', { method: "post", headers: headers, body: body })
        .then(response => response.json())
        .then(data => {
            if (data['res'] == 'yes') {
                const sizes = [20, 40, 60, 80, 100]
                let type = prompt('Which type of level do you want to edit?')
                let size

                let boolean
                do {
                    boolean = false
                    switch (type.toLowerCase()) {
                        case 'very easy':
                            document.getElementById('before').style.display = "none"
                            size = sizes[0]
                            break;
                        case 'easy':
                            document.getElementById('before').style.display = "none"
                            size = sizes[1]
                            break;
                        case 'medium':
                            document.getElementById('before').style.display = "none"
                            size = sizes[2]
                            break;
                        case 'hard':
                            document.getElementById('before').style.display = "none"
                            size = sizes[3]
                            break;
                        case 'very hard':
                            document.getElementById('before').style.display = "none"
                            size = sizes[4]
                            break;
                        default:
                            type = prompt('Which type of level do you want to edit?')
                            boolean = true
                            break
                    }
                } while (boolean == true)

                const board = document.getElementById("board")
                const colours = ["blue", "red", "black", "white"]
                const boxes = size / 20
                const boxSize = 25
                for (let i = 0; i < size * size; i++) {
                    let box = document.createElement("div")
                    box.classList.add('box')
                    box.setAttribute("id", i)

                    box.style.width = (boxSize / boxes).toString() + "px"
                    box.style.height = (boxSize / boxes).toString() + "px"

                    box.addEventListener("click", function () {
                        position(box, number)
                    })

                    board.appendChild(box)
                }

                const position = function (el, number) {
                    for (let i = 0; i < level.length; i++) {
                        if (document.getElementById('material_name').innerText == 'player1' && document.getElementById(level[i].id).style.backgroundColor == "blue") {
                            level.splice(i, 1)
                        }
                        if (document.getElementById('material_name').innerText == 'player2' && document.getElementById(level[i].id).style.backgroundColor == "red") {
                            level.splice(i, 1)
                        }
                    }

                    const elements = document.querySelectorAll('.box')
                    elements.forEach((elem) => {
                        if (document.getElementById('material_name').innerText == 'player1' && elem.style.backgroundColor == "blue") {
                            elem.style.backgroundColor = 'white'
                        }
                        if (document.getElementById('material_name').innerText == 'player2' && elem.style.backgroundColor == "red") {
                            elem.style.backgroundColor = 'white'
                        }
                    })

                    el.style.backgroundColor = colours[number]

                    let ob = {}
                    ob["id"] = el.getAttribute("id")
                    ob["type"] = document.getElementById('material_name').innerText

                    for (let i = 0; i < level.length; i++) {
                        if (el.getAttribute("id") == level[i].id) level.splice(i, 1)
                    }

                    if (document.getElementById('material_name').innerText != "delete" && document.getElementById('material_name').innerText != "nothing") level.push(ob)
                    if (document.getElementById('material_name').innerText == "nothing") alert("Choose one of the types")

                    document.querySelector("pre").innerText = JSON.stringify(level, null, ' ')
                }
                let number
                let level = []

                document.querySelector("pre").innerText = JSON.stringify(level)

                const materials = document.querySelectorAll(".material")

                for (let i = 0; i < materials.length; i++) {
                    materials[i].addEventListener("click", function () {
                        document.getElementById("material_name").innerText = materials[i].innerText.toLowerCase()
                        document.getElementById("now").style.backgroundColor = colours[i]
                        if (document.getElementById("now").style.backgroundColor == 'black') document.getElementById("now").style.backgroundColor = "white"
                        number = i
                    })
                }

                document.getElementById("save_lvl").addEventListener("click", function () {
                    const body = JSON.stringify({ "size": size, "list": level })
                    const header = { "Content-Type": "application/json" }

                    let players = 0
                    level.forEach((el) => {
                        if (el.type[0] == 'p') players++
                    })

                    if (players == 2) fetch('/save', { method: "post", headers: headers, body: body })
                    else alert('Choose players positions')
                })
            } else start()
        })
}

window.onload = start