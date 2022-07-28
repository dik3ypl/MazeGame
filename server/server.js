//zmienne, stałe

var express = require('express');
var bodyParser = require("body-parser")
var session = require("express-session");
var favicon = require('serve-favicon');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PORT = process.env.PORT || 3000;
var path = require("path")
var Datastore = require("nedb")

var veasy = new Datastore({
    filename: 'veasy.db',
    autoload: true
});
var easy = new Datastore({
    filename: 'easy.db',
    autoload: true
});
var medium = new Datastore({
    filename: 'medium.db',
    autoload: true
});
var hard = new Datastore({
    filename: 'hard.db',
    autoload: true
});
var vhard = new Datastore({
    filename: 'vhard.db',
    autoload: true
});

var waitingPlayers = 0
var players = 0
var rooms = 0
var password = 'admin'

//pomocnicze składniki aplikacji

app.use(express.static("static"))
app.use(express.static("node_modules"))
app.use(express.static("static/dist"))
app.use(session({
    secret: 'keyboard cat',
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("*.js", function (req, res) {
    res.sendFile(__dirname + "/" + req.url)
})
app.use(favicon(__dirname + '/static/images/favicon.ico'));

//obsługiwane sockety, end-pointy

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname + "/static/start.html"))
})

app.get('/wait', function (req, res, next) {
    req.session.start = true
    res.sendFile(path.join(__dirname + "/static/main.html"))
})

app.get('/menu', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/menu.html"))
})

app.get('/load', function (req, res) {
    res.send(JSON.stringify(req.session))
})

app.post('/login', function (req, res) {
    if (req.body.login == password) res.send(JSON.stringify({ res: 'yes' }))
    else res.send(JSON.stringify({ res: 'no' }))
})

app.post('/save', function (req, res) {
    switch (req.body.size) {
        case 20:
            veasy.insert(req.body)
            break;
        case 40:
            easy.insert(req.body)
            break;
        case 60:
            medium.insert(req.body)
            break;
        case 80:
            hard.insert(req.body)
            break;
        case 100:
            vhard.insert(req.body)
            break;
    }
})

app.get('/game', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/dist/game.html"))
})

app.get('/editor', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/editor.html"))
})

app.get('/quit', function (req, res) {
    waitingPlayers = waitingPlayers - 1
    console.log("Players in queue: " + waitingPlayers)
})
app.get('/win', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/win.html"))
})

app.get('/lose', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/lose.html"))
})

app.post('/play', function (req, res, next) {
    req.session.player = req.body.player
    req.session.room = req.body.room
    req.session.level = req.body.level
    req.session.m1 = req.body.m1
    req.session.m2 = req.body.m2
    res.send(JSON.stringify(req.session))
})

io.on('connection', (socket) => {
    socket.on('join', () => {
        waitingPlayers = waitingPlayers + 1

        console.log("Players in queue: " + waitingPlayers)
        socket.emit('join', waitingPlayers)
        socket.broadcast.emit('join', waitingPlayers)
    });

    socket.on('room', () => {
        waitingPlayers = 0
        players = players + 1

        var playerID
        if (players % 2 == 1) {
            playerID = 2
            rooms = rooms + 1
        } else playerID = 1

        var data = {
            player: "player" + playerID.toString(),
            room: "room" + rooms.toString()
        }

        socket.emit('room', JSON.stringify(data))
    });

    socket.on('color', (btn, room) => {
        socket.emit(room + 'color', btn)
        socket.broadcast.emit(room + 'color', btn)
    })

    socket.on('player1', (btn, room) => {
        socket.emit(room + 'player1', btn)
        socket.broadcast.emit(room + 'player1', btn)
    })

    socket.on('player2', (btn, room) => {
        socket.emit(room + 'player2', btn)
        socket.broadcast.emit(room + 'player2', btn)
    })

    socket.on('start', (room, level, m1, m2) => {
        let board
        switch (level) {
            case 'VERY EASY':
                veasy.find({}, function (err, docs) {
                    const random = Math.floor(Math.random() * docs.length)

                    if (docs.length > 0) {
                        socket.emit(room + 'start', docs[random], m1, m2)
                        socket.broadcast.emit(room + 'start', docs[random], m1, m2)
                    } else {
                        socket.emit(room + 'start', { "size": 20, "list": [] }, m1, m2)
                        socket.broadcast.emit(room + 'start', { "size": 20, "list": [] }, m1, m2)
                    }
                });
                break;
            case 'EASY':
                easy.find({}, function (err, docs) {
                    const random = Math.floor(Math.random() * docs.length)

                    if (docs.length > 0) {
                        socket.emit(room + 'start', docs[random], m1, m2)
                        socket.broadcast.emit(room + 'start', docs[random], m1, m2)
                    } else {
                        socket.emit(room + 'start', { "size": 40, "list": [] }, m1, m2)
                        socket.broadcast.emit(room + 'start', { "size": 40, "list": [] }, m1, m2)
                    }
                });
                break;
            case 'MEDIUM':
                medium.find({}, function (err, docs) {
                    const random = Math.floor(Math.random() * docs.length)

                    if (docs.length > 0) {
                        socket.emit(room + 'start', docs[random], m1, m2)
                        socket.broadcast.emit(room + 'start', docs[random], m1, m2)
                    } else {
                        socket.emit(room + 'start', { "size": 60, "list": [] }, m1, m2)
                        socket.broadcast.emit(room + 'start', { "size": 60, "list": [] }, m1, m2)
                    }
                });
                break;
            case 'HARD':
                hard.find({}, function (err, docs) {
                    const random = Math.floor(Math.random() * docs.length)

                    if (docs.length > 0) {
                        socket.emit(room + 'start', docs[random], m1, m2)
                        socket.broadcast.emit(room + 'start', docs[random], m1, m2)
                    } else {
                        socket.emit(room + 'start', { "size": 80, "list": [] }, m1, m2)
                        socket.broadcast.emit(room + 'start', { "size": 80, "list": [] }, m1, m2)
                    }
                });
                break;
            case 'VERY HARD':
                vhard.find({}, function (err, docs) {
                    const random = Math.floor(Math.random() * docs.length)

                    if (docs.length > 0) {
                        socket.emit(room + 'start', docs[random], m1, m2)
                        socket.broadcast.emit(room + 'start', docs[random], m1, m2)
                    } else {
                        socket.emit(room + 'start', { "size": 100, "list": [] }, m1, m2)
                        socket.broadcast.emit(room + 'start', { "size": 100, "list": [] }, m1, m2)
                    }
                });
                break;
        }
    })

    socket.on('position', (room, player, position, rotation, move, back) => {
        var res
        if (player == 'player1') res = 'player2'
        if (player == 'player2') res = 'player1'

        socket.broadcast.emit('position' + room + res, position, rotation, move, back)
    })

    socket.on('end', (room, player) => {
        socket.emit('end' + room, player)
        socket.broadcast.emit('end' + room, player)
    })
});

server.listen(PORT, function () {
    console.log('listening on *:' + PORT);
});