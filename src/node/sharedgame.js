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
    this.dimension = 10;
    if (data.personal) {
        this.personal = true;
        console.log('start personal');
    } else {
        console.log('start open');
    }
    if (data.dim) {
        this.dimension = data.dim;
    }
    this.pole = [];
    this.sockets = [];
    this.slots = [];
    this.changes = [];
    for (var y = 0; y < this.dimension; y++) {
        var line = [];
        this.pole.push(line);
        for (var x = 0; x < this.dimension; x++) {
            line.push(0);
        }
    }
    this.readytosend = true;
    this.updaterate = Math.round(1000 / 12);
    this.lastmoved = null;
    this.lastActive = new Date();
    if (data.save) {
        this.pole = data.save.pole;
        this.slots = data.save.slots;
    }
    if (this.personal && this.slots.length > 1) {
        this.slots.shift();
        for (var s in this.slots) {
            this.slots[s].free = true;
        }
    }
}

Game.prototype.getPoleState = function(callback) {
    callback({'pole': this.pole});

}

Game.prototype.getSlot = function() {
    var find = false;
    for (var s in this.slots) {
        if (this.slots[s].free === true) {
            find = this.slots[s];
            break;
        }
    }
    if (!find) {
        if (this.slots.length < 4) {
            var slot = {free: true, currents: []}
            for (var a = 0; a < 2; a++) {
                var nxt = {};
                slot.currents.push(nxt);
                setnext(nxt, slot.currents);
            }
            slot.score = 0;
            this.slots.push(slot);
            return slot;
        }
    } else {
        return find;
    }

}

Game.prototype.insertFigure = function(socket, callback) {
    if (socket.currentGame && socket.currentGame == this) {
        var valid = true;
        if (socket.figure.length == 4 && this.checkFigure(socket)) {
            for (var f in socket.figure) {
                var sf = socket.figure[f];
                sf.state = 'placed';
                this.pole[sf.y][sf.x] = 1;
            }
            this.emit('placed', socket.figure);
            socket.figure = [];
            socket.score += 4;
            setnext(socket.currents[socket.checkindex], socket.currents);
            var nnd = {
                newnext: {
                    figure: socket.currents[socket.checkindex].figure,
                    index: socket.checkindex},
                exp: socket.user.addXp(4),
                score: socket.score,
                userid: socket.user.dbdata._id.toString()

            }
            this.lastmoved = socket;

            this.emit('playerupdate', nnd);

            this.lastActive = new Date();

            this.checkLines();
            this.checkGameOver()
        }

    }
}
Game.prototype.checkGameOver = function() {
    if (this.checkEnd()) {
        this.pole = [];
        for (var y = 0; y < this.dimension; y++) {
            var line = [];
            this.pole.push(line);
            for (var x = 0; x < this.dimension; x++) {
                line.push(0);
            }
        }
        var users = [];
        if (this.personal){
            this.save();
        }
        for (var s in this.sockets) {
            var so = this.sockets[s];
            if (so.user.dbdata.hiscore < so.score) {
                so.user.dbdata.hiscore = so.score;
            }
            so.user.dbdata.totalgames++;
            users.push({
                id: so.user.dbdata._id.toString(),
                name: so.user.dbdata.name,
                score: so.score,
                hiscore: so.user.dbdata.hiscore
            });
            so.score = 0;
            so.figure = [];
            so.user.save();
        }
        this.emit('gameover', {'users': users});
    }
}

Game.prototype.checkEnd = function() {
    for (var s in this.sockets) {
        if (!this.sockets[s].blured) {
            var curents = this.sockets[s].currents;
            for (var f in curents) {
                var curent = curents[f].figure;
                for (var x in this.pole) {
                    for (var y in this.pole[x]) {
                        var counter = 0;
                        for (var i in curent) {
                            var cx = curent[i].y;
                            var cy = curent[i].x;
                            var tx = parseInt(y);
                            var ty = parseInt(x);
                            if (cx + tx < this.dimension && cy + ty < this.dimension) {
                                if (this.pole[cx + tx][cy + ty] != 1) {
                                    counter += 1;
                                }
                            }
                        }
                        if (counter === 4) {
                            return false;
                        }

                    }
                }
            }
        }
    }
    return true;
}

Game.prototype.rebuildfigures = function(line) {
    for (var s in this.sockets) {
        for (var f in this.sockets[s].figure) {
            if (line.line > 4) {
                if (line.dir == 'y' && this.sockets[s].figure[f].x > 4) {
                    this.sockets[s].figure[f].x--;
                }
                if (line.dir == 'x' && this.sockets[s].figure[f].y > 4) {
                    this.sockets[s].figure[f].y--;
                }

            }
            if (line.line < 5) {
                if (line.dir == 'y' && this.sockets[s].figure[f].x < 5) {
                    this.sockets[s].figure[f].x++;
                }
                if (line.dir == 'x' && this.sockets[s].figure[f].y < 5) {
                    this.sockets[s].figure[f].y++;
                }

            }
        }
    }
}


Game.prototype.checkLines = function() {
    var outlines = [];
    for (var j in this.pole) {
        var xcounter = 0;
        var ycounter = 0;

        for (var i in this.pole[j]) {
            if (this.pole[j][i] == 1) {
                xcounter++;
            }
            if (this.pole[i][j] == 1) {
                ycounter++;
            }
        }
        if (xcounter == this.dimension) {
            outlines.push({dir: 'x', line: j});
        }
        if (ycounter == this.dimension) {
            outlines.push({dir: 'y', line: j});
        }
    }
    if (outlines.length) {
        this.broadcast();
        this.emit('outlines', outlines);
        var socket = this.lastmoved;
        var addscore = 10 * (outlines.length * outlines.length);
        socket.score += addscore;
        var nnd = {
            exp: socket.user.addXp(addscore),
            score: socket.score,
            userid: socket.user.dbdata._id.toString()

        }

        this.emit('playerupdate', nnd);

    }
    for (var out in outlines) {
        var line = outlines[out];
        this.rebuildfigures(line);
        if (line.dir === 'x') {
            //empty line
            for (var i in this.pole[line.line]) {
                this.pole[line.line][parseInt(i)] = 0;
            }
            //rearange array
            var shift = 0;
            if (line.line > 4) {
                this.pole.push(this.pole.splice(line.line, 1)[0]);
                shift = 1;
            } else {
                this.pole.unshift(this.pole.splice(line.line, 1)[0]);
                shift = -1;
            }
        } else {
            for (var i in this.pole[line.line]) {
                var ivar = parseInt(i);
                this.pole[ivar][line.line] = 0;

                var f = this.pole[ivar].splice(line.line, 1)[0];
                if (line.line > 4) {
                    this.pole[ivar].push(f);
                } else {
                    this.pole[ivar].unshift(f);
                }
            }
        }
        for (var last = parseInt(out) + 1; last < outlines.length; last++) {
            var nextline = outlines[last];
            if (nextline.dir === line.dir) {
                if (nextline.line > 4 && line.line > 4) {
                    nextline.line -= 1;
                }
            }
        }
        //score += 10 * outlines.length;
    }

}

Game.prototype.checkFigure = function(socket) {
    var ok = function(sx, sy) {
        for (var a in socket.currents) {
            var curent = socket.currents[a].figure;
            var counter = 0;
            for (var b in socket.figure) {
                for (var d in curent) {
                    if (((socket.figure[b].x - sx) == curent[d].x) && ((socket.figure[b].y - sy) == curent[d].y)) {
                        counter++;
                    }
                }
            }
            if (counter == socket.figure.length) {
                socket.checkindex = a;
                return true;
            }
        }
        return false;
    }
    if (socket.figure.length > 1) {
        var lowx = this.dimension;
        var lowy = this.dimension;
        for (var a in socket.figure) {
            var block = socket.figure[a];
            if (block.x < lowx) {
                lowx = block.x;
            }
            if (block.y < lowy) {
                lowy = block.y;
            }
        }
        if (ok(lowx, lowy) || ok(lowx - 1, lowy) || ok(lowx, lowy - 1) || ok(lowx - 2, lowy) || ok(lowx, lowy - 2)) {
            return true;
        } else {
            var ftd = socket.figure.shift();
            if (this.pole[ftd.y][ftd.x] != 1) {
                ftd.state = 'empty';
                this.broadcast(ftd);
            }
            return false;
        }
    }
}


Game.prototype.pickPixel = function(pixel, socket) {
    if (socket.currentGame && socket.currentGame == this) {
        if (socket.blured) {
            socket.blured = false;
            this.emit('userblur', {id: socket.user.dbdata._id.toString(), blur: socket.blured});
        }
        if (this.pole[pixel.y][pixel.x] > 0) {
            return;
        }
        for (var f in socket.figure) {
            if ((socket.figure[f].x == pixel.x) && (socket.figure[f].y == pixel.y)) {
                return;
            }
        }
        socket.figure.push(pixel);
        this.broadcast(pixel);
        this.checkFigure(socket);
    }
}

Game.prototype.emit = function(event, data) {
    for (var s in this.sockets) {
        var socket = this.sockets[s];
        socket.emit(event, data);
    }
}

Game.prototype.broadcast = function(change) {
    if (change) {
        this.changes.push(change);
        if (change.state == 'placed') {
            this.pole[change.y][change.x] = 1;
        } else {
            this.pole[change.y][change.x] = 0;
        }
        //  this.pole[change.y][change.x].state = change.state;
    }
    var gm = this;
    if (this.changes.length) {
        if (gm.readytosend) {
            this.emit('update', this.changes);
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
    console.log(socket.user.dbdata.name + ' enter game');
    var slot = this.getSlot();
    slot.socket = socket;
    slot.free = false;
    this.sockets.push(socket);
    socket.currentGame = this;
    socket.score = slot.score;
    socket.figure = [];
    socket.currents = slot.currents;
    socket.blured = false;
    var initData = {};
    initData.users = [];
    for (var u in this.sockets) {
        var userdata = {
            id: this.sockets[u].user.dbdata._id.toString(),
            name: this.sockets[u].user.dbdata.name,
            score: this.sockets[u].score,
            currents: this.sockets[u].currents,
            blured: this.sockets[u].blured
        }
        initData.users.push(userdata);
    }
    initData.pole = this.pole;
    var userdata = {
        id: socket.user.dbdata._id.toString(),
        name: socket.user.dbdata.name,
        score: socket.score,
        currents: socket.currents
    }
    this.emit('newuser', userdata);
    callback(initData);
    this.checkGameOver();
}


Game.prototype.removePlayer = function(socket, callback) {
    console.log('remove ' + socket.user.dbdata.name + ' from game');
    for (var ss in this.slots) {
        if (this.slots[ss].socket == socket) {
            this.slots[ss].currents = socket.currents;
            this.slots[ss].score = socket.score;
            this.slots[ss].free = true;
        }
    }
    for (var f in socket.figure) {
        var sf = socket.figure[f];
        sf.state = 'empty';
        this.broadcast(sf);
    }
    for (var s in this.sockets) {
        if (this.sockets[s] == socket) {
            this.sockets.splice(s, 1);
            break;
        }
    }
    socket.blured = false;
    socket.user.save();
    this.emit('deluser', {id: socket.user.dbdata._id.toString()});
    this.checkGameOver();
    callback();
}

Game.prototype.blurUser = function(socket) {
    console.log(socket.user.dbdata.name + ' blured');
    socket.blured = true;
    for (var f in socket.figure) {
        var sf = socket.figure[f];
        sf.state = 'empty';
        this.broadcast(sf);
    }
    this.emit('userblur', {id: socket.user.dbdata._id.toString(), blur: socket.blured});
}
Game.prototype.save = function() {
    if (this.personal) {
        console.log('game is personal');
        if (this.slots[0].socket && this.slots[0].socket.user) {
            console.log('slots[0].socket.user finded');
            var slot = this.slots[0];
            var user = this.slots[0].socket.user;
            slot.currents = slot.socket.currents;
            var gamedata = {
                pole: this.pole,
                slots: [
                    {currents: slot.currents, score: slot.score}
                ]
            }
            console.log(gamedata);
            user.dbdata.game = gamedata;
            user.save();
        }
    }
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
