var db = require('./db.js');

var refs = refs = [
    [
        {
            x: 0,
            y: 0
        },
        {
            x: 0,
            y: 1
        },
        {
            x: 0,
            y: 2
        },
        {
            x: 0,
            y: 3
        }
    ],
    [
        {
            x: 0,
            y: 0
        },
        {
            x: 1,
            y: 0
        },
        {
            x: 2,
            y: 0
        },
        {
            x: 3,
            y: 0
        }
    ],
    [
        {
            x: 0,
            y: 1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: 0
        },
        {
            x: 0,
            y: 0
        }
    ],
    [
        {
            x: 0,
            y: 1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: 0
        },
        {
            x: 2,
            y: 0
        }
    ],
    [
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: 0
        },
        {
            x: 0,
            y: 0
        }
    ],
    [
        {
            x: 0,
            y: 2
        },
        {
            x: 0,
            y: 1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: 0
        }
    ],
    [
        {
            x: 1,
            y: 2
        },
        {
            x: 0,
            y: 1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 0,
            y: 0
        }
    ],
    [
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 0,
            y: 1
        },
        {
            x: 0,
            y: 0
        }
    ],
    [
        {
            x: 0,
            y: 2
        },
        {
            x: 0,
            y: 1
        },
        {
            x: 0,
            y: 0
        },
        {
            x: 1,
            y: 0
        }
    ],
    [
        {
            x: 1,
            y: 2
        },
        {
            x: 0,
            y: 2
        },
        {
            x: 0,
            y: 1
        },
        {
            x: 0,
            y: 0
        }
    ],
    [
        {
            x: 0,
            y: 2
        },
        {
            x: 1,
            y: 2
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: 0
        }
    ],
    [
        {
            x: 2,
            y: 0
        },
        {
            x: 1,
            y: 0
        },
        {
            x: 0,
            y: 0
        },
        {
            x: 0,
            y: 1
        }
    ],
    [
        {
            x: 1,
            y: 2
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: 0
        },
        {
            x: 0,
            y: 0
        }
    ],
    [
        {
            x: 2,
            y: 1
        },
        {
            x: 2,
            y: 0
        },
        {
            x: 1,
            y: 0
        },
        {
            x: 0,
            y: 0
        }
    ],
    [
        {
            x: 2,
            y: 0
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 0,
            y: 1
        }
    ],
    [
        {
            x: 1,
            y: 0
        },
        {
            x: 2,
            y: 1
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 0,
            y: 1
        }
    ],
    [
        {
            x: 1,
            y: 1
        },
        {
            x: 0,
            y: 0
        },
        {
            x: 1,
            y: 0
        },
        {
            x: 2,
            y: 0
        }
    ],
    [
        {
            x: 1,
            y: 1
        },
        {
            x: 0,
            y: 2
        },
        {
            x: 0,
            y: 1
        },
        {
            x: 0,
            y: 0
        }
    ],
    [
        {
            x: 0,
            y: 1
        },
        {
            x: 1,
            y: 2
        },
        {
            x: 1,
            y: 1
        },
        {
            x: 1,
            y: 0
        }
    ]
];

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

Game.prototype.insertFigure = function(socket, callback) {
    if (socket.currentGame && socket.currentGame == this) {
        var valid = true;
        if (valid) {
            if (socket.figure.length == 4) {
                for (var f in socket.figure) {
                    var sf = socket.figure[f];
                    sf.state = 'placed';
                    this.broadcast(sf);
                }
                socket.figure = [];
            }
        }
    }
}
Game.prototype.pickPixel = function(pixel, socket) {
    if (socket.currentGame && socket.currentGame == this) {
        var valid = true;
        if (this.pole[pixel.y][pixel.x] > 1) {
            valid = false;
            return;
        }
        for (var f in socket.figure) {
            var sp = socket.figure[f];
            if ((sp.x == pixel.x) && (sp.y == pixel.y)) {
                valid = false;
                break;
            }
        }

        if (valid) {
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
        if (change.state == 'placed') {
            this.pole[change.y][change.x] = 2;
        }
        if (change.state == 'active') {
            this.pole[change.y][change.x] = 1;
        }
        if (change.state == 'empty') {
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

    this.sockets.push(socket);
    this.users.push(socket.user);

    socket.currentGame = this;
    socket.figure = [];
    socket.currents = [];
    for (var a = 0; a < 2; a++) {
        var nxt = {};
        socket.currents.push(nxt);
        setnext(nxt, socket.currents);
    }
    console.log(socket.currents[0].figure);
    var initData = {};
    initData.currents = [socket.currents[0].figure, socket.currents[1].figure];
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
            for (var f in socket.figure) {
                var sf = socket.figure[f];
                sf.state = 'empty';
                this.broadcast(sf);
            }
            this.sockets.splice(s, 1);
            break;
        }
    }
    callback();
}
Game.prototype.save = function() {
    console.log('saving', this.dbdata.name);
    db.saveGame(this.dbdata, function(data) {
        console.log('game saved - ', data);
    });
    return this;
}

exports.Game = Game;


function setnext(nextfigure, curents, index) {
    if (index) {
        hr = index;
    } else {
        var getrandom = function() {
            var holyrandom = Math.round(Math.random() * (refs.length - 1));
            if (curents && curents.length == 2) {
                if (curents[1].refindex == holyrandom || curents[0].refindex == holyrandom) {
                    holyrandom = getrandom();
                }
            }

            return holyrandom;
        }
        var hr = getrandom();
    }
    nextfigure.figure = refs[hr];
    nextfigure.refindex = hr;
}
