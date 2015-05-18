var db = require('./db.js');

function Game(data) {
    if (data.dim) {
        this.dimention = data.dim;
    }
    this.pole = [];
    this.users = [];
    this.sockets = [];
    this.changes = [];

    this.gameId = 'shared' + Math.round(Math.random() * 100000);
    for (var y = 0; y < this.dimention; y++) {
        var line = [];
        this.pole.push(line);
        for (var x = 0; x < this.dimention; x++) {
            line.push(0);
        }
    }
    this.readytosend = true;
    this.updaterate = Math.round(1000 / 12);
}

Game.prototype.pickPixel = function(pixel, socket, callback) {
    if (socket.currentGame && socket.currentGame == this) {
        var valid = true;

        for (var f in socket.figure) {
            var sp = socket.figure[f];
            if ((sp.x == pixel.x) && (sp.y == pixel.y)) {
                valid = false;
                break;
            }
        }
        if (valid) {
            console.log(pixel);
            socket.figure.push(pixel);
            if (socket.figure.length > 4) {
                var ftd = socket.figure.shift();
                ftd.state = 'empty';
                this.broadcast(ftd);
            }
            this.broadcast(pixel);

        }
    }
}

Game.prototype.broadcast = function(change) {
    if (change) {
        this.changes.push(change);
        if (change.state == 'active') {
            this.pole[change.y][change.x] = 1;
        } else {
            this.pole[change.y][change.x] = 0;
        }
        this.pole[change.y][change.x].state = change.state;
        console.log(this.pole);
    }
    var gm = this;
    if (this.changes.length) {
        if (gm.readytosend) {
            for (var s in this.sockets) {
                var socket = this.sockets[s];
                socket.emit('update', this.changes);
            }
            this.changes = [];
            setTimeout(function() {
                gm.readytosend = true;
                if (gm.changes.length) {
                    gm.broadcast()
                }
            }, this.updaterate);
        }
        this.readytosend = false;
    }
}


Game.prototype.addPlayer = function(socket, callback) {
    socket.currentGame = this;
    socket.figure = [];

    var initData = {};
    this.sockets.push(socket);
    this.users.push(socket.user);
    initData.gameid = this.gameId;
    initData.pole = this.pole;
    initData.users = this.users;
    callback(initData);
}


Game.prototype.removePlayer = function(socket, callback) {
    for (var u in this.users) {
        var user = this.users[u];
        if (user == socket.user) {
            this.users.splice(u, 1);
            break;
        }
    }
    for (var s in this.sockets) {
        var sk = this.sockets[s];
        if (sk == socket) {
            this.sockets.splice(s, 1);
            break;
        }
    }
    callback();
}
Game.prototype.save = function() {
    console.log('saving', this.dbdata.name);
    db.saveGame(this.dbdata, function(data) {
        console.log('user saved - ', data);
    });
    return this;
}

exports.Game = Game;
