if (document.cookie != "session=yes") {
    const back = document.createElement("a")
    back.setAttribute("href", "/")
    document.body.appendChild(back)
    back.click()
}

const socket = io("/");

socket.emit('room');

socket.on('room', function (data) {
    const json = JSON.parse(data)
    const headers = { "Content-Type": "application/json" }
    document.cookie = "session=no"

    const player = json['player']
    const room = json['room']
    let color = 'red'
    if (player == 'player2') color = 'blue'

    const buttons = document.querySelectorAll(".color")

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            socket.emit('color', btn.getAttribute('id'), room)
        })
    })

    socket.on(room + 'color', function (data) {
        buttons.forEach((el) => {
            el.style.border = "5px white solid"
            el.style.color = "white"
        })

        document.getElementById(data).style.border = "8px blue solid"
        document.getElementById(data).style.color = "blue"
    })

    const model1 = document.querySelectorAll(".player1")
    const model2 = document.querySelectorAll(".player2")

    if (player == 'player1') {
        model1.forEach((btn) => {
            btn.addEventListener("click", () => {
                socket.emit('player1', btn.getAttribute('id'), room)
            })
        })
    } else {
        model2.forEach((btn) => {
            btn.addEventListener("click", () => {
                socket.emit('player2', btn.getAttribute('id'), room)
            })
        })
    }

    socket.on(room + 'player1', function (data) {
        model1.forEach((el) => {
            el.style.border = "5px white solid"
            el.style.color = "white"
        })

        document.getElementById(data).style.border = "8px blue solid"
        document.getElementById(data).style.color = "blue"
    })

    socket.on(room + 'player2', function (data) {
        model2.forEach((el) => {
            el.style.border = "5px white solid"
            el.style.color = "white"
        })

        document.getElementById(data).style.border = "8px red solid"
        document.getElementById(data).style.color = "red"
    })

    if (player == 'player1') {
        document.getElementById('start').addEventListener('click', function () {
            let options = 0
            let level
            let m1
            let m2
            document.querySelectorAll('button').forEach((btn) => {
                if (btn.style.color == 'blue' || btn.style.color == 'red') {
                    options++

                    if (btn.getAttribute('class') == 'color') level = btn.innerText
                    if (btn.getAttribute('class') == 'player1') m1 = btn.innerText
                    if (btn.getAttribute('class') == 'player2') m2 = btn.innerText
                }
            })

            if (options == 3) {
                socket.emit('start', room, level, m1, m2)
            } else {
                alert("You must choose level and models before start!")
            }
        })
    } else {
        document.getElementById('start').addEventListener('click', function () {
            alert("You're not a room owner")
        })
    }

    socket.on(room + 'start', (level, m1, m2) => {
        const headers = { "Content-Type": "application/json" }
        const body = JSON.stringify({ player: player, room: room, level: level, m1: m1, m2: m2 })
        fetch('/play', { method: "post", headers: headers, body: body })
            .then(response => response.json())
            .then(
                data => {
                    document.cookie = "session=yes"
                    const game = document.createElement("a")
                    game.setAttribute("href", "/game")
                    document.body.appendChild(game)
                    game.click()
                }
            )
    })
})