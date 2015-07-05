var io = require('socket.io')(40040);
var http = require('http');
var options = require('./options.json');
var db = require('./db.js');
var User = require('./user.js').User;
//var PGame = require('./personalgame.js').Game;
var SharedGame = require('./sharedgame.js').Game;
var opengames = [];
var games = [];
var users = [];
var debug = false;
var waitforshared = [];


var systemdata = function() {

    var data = {
        'users': [],
        'games': games.length,
        'opengames': opengames.length
    };
    for (var u in users) {
        data.users.push(users[u].minimize());
    }

    return data;
}

var sortByActivity = function(mass) {
    return mass.sort(function(a, b) {
        if (a.sockets.length != b.sockets.length) {
            return a.sockets.length - b.sockets.length;
        } else {
            return b.lastActive - a.lastActive;
        }
    });
}

var bindcommands = function(socket) {
    socket.on('shutdown', function(data) {
        if (socket.user && socket.user.dbdata._id.toString() === "555e90116e88debb335b91cd") {
            var timeout = 2000;
            if (data.timeout) {
                timeout = data.timeout;
            }
            io.emit('alert', data);
            if (data.reason) {
                console.log(data.reason);
            }
            setTimeout(function() {
                for (var g in games) {
                    games[g].save();
                }
                setTimeout(function() {
                    process.exit();
                }, 3000);

            }, timeout);
        }

    });
    socket.on('saveuser', function(data) {
        if (data.id && socket.user && socket.user.dbdata._id.toString() === data.id) {
            if (data.color) {
                socket.user.dbdata.color = data.color;
            }
            if (socket.currentGame) {
                socket.currentGame.updateUser(socket.user);
            }
        }

    });
    socket.on('getleaderboard', function(data, callback) {
        if (data.type) {
            db.getLeaderboard({type: data.type}, callback);
        }
    });
    socket.on('blur', function() {
        if (socket.currentGame) {
            socket.currentGame.blurUser(socket);
        }
    });
    socket.on('getuser', function(data, callback) {
        if (data.id) {
            console.log('geting user ' + data.id);
            for (var u in users) {
                if (data.id === users[u].dbdata._id.toString()) {
                    console.log('finded');
                    users[u].fullData(callback);
                    return;
                }
            }
            db.getUser({dbid: data.id}, function(data) {
                if (data.user) {
                    if (callback) {
                        data.user.fullData(callback);

                    }
                }
            });
        }
    });
    socket.on('syncstate', function(callback) {
        if (socket.currentGame) {
            socket.currentGame.getPoleState(callback);
        }
    });
    socket.on('insert', function(callback) {
        if (socket.currentGame) {
            socket.currentGame.insertFigure(socket, callback);
        }
    });
    socket.on('pick', function(data) {
        if (socket.currentGame) {
            socket.currentGame.pickPixel(data, socket);
        }
    });
    socket.on('getgame', function(data, callback) {
            var createshared = function() {
                var game = new SharedGame({dim: 10});
                opengames.push(game);
                game.addPlayer(socket, callback);
                emitglobal({newshared: {id: game.id, user: {_id: socket.user.dbdata._id.toString(), name: socket.user.dbdata.name}}});

            }
            var createpersonal = function() {
                var game = new SharedGame({dim: 10, personal: true, save: socket.user.dbdata.game});
                games.push(game);
                game.addPlayer(socket, callback);
            }
            if (data.gt == 'personal') {
                removeSocket(socket, function() {
                    createpersonal();
                });

            }
            if (data.gt == 'newopen') {
                removeSocket(socket, function() {
                    createshared();
                });
            }

            if (data.gt == 'open') {
                var finded = false;

                removeSocket(socket, function() {
                    if (opengames.length) {
                        var freeslots = [];
                        for (var g in opengames) {
                            if (opengames[g].sockets.length < 4) {
                                var ingame = false;
                                for (var s in opengames[g].sockets) {
                                    if (opengames[g].sockets[s].user.dbdata._id.toString() === socket.user.dbdata._id.toString()) {
                                        ingame = true;
                                    }
                                }
                                if (!ingame) {
                                    freeslots.push(opengames[g]);
                                }
                            }
                        }
                        if (freeslots.length) {
                            freeslots = sortByActivity(freeslots);
                            console.log(freeslots.length);
                            console.log(socket.gameskip);
                            if (socket.gameskip < freeslots.length) {

                                freeslots[socket.gameskip].addPlayer(socket, callback);
                                finded = true;
                                socket.gameskip++;

                            } else {
                                socket.gameskip = 0;
                            }
                        }
                    }
                    if (!finded) {
                        createshared();
                        // waitforshared.push({so: socket, call: callback});
                    }
                });

            }
        }
    );
}

var emitglobal = function(e) {
    io.emit('globalevent', {event: e, systemdata: systemdata()});
}

var removeSocket = function(socket, callback) {
    if (socket.currentGame) {
        socket.currentGame.removePlayer(socket, function() {
            if (socket.currentGame.sockets.length < 1) {
                if (socket.currentGame.personal) {
                    for (var g in games) {
                        if (games[g] == socket.currentGame) {
                            games.splice(g, 1);
                        }
                    }
                } else {
                    for (var og in opengames) {
                        if (opengames[og] == socket.currentGame) {
                            opengames.splice(og, 1);
                            emitglobal({});
                        }
                    }

                }
            }
            if (callback) {
                callback();
            }
        });
    } else {
        if (callback) {
            callback();
        }
    }

}

var removeUser = function(user) {
    setTimeout(function() {
        if (user) {
            for (var u in users) {
                if (user == users[u]) {
                    users.splice(u, 1);
                    emitglobal({});
                }
            }
        }
    }, 5000);
}

io.on('connection', function(socket) {

    console.log('socket', socket.id, 'connected');

    socket.on('systeminfo', function(callback) {
        callback(systemdata());
    });

    socket.on('login', function(data, callback) {
        socket.gameskip = 0;
        if (data.s) {
            db.getSessionUser(data.s, function(d) {
                if (d.user) {
                    if (d.user.getSessionId(socket) === data.s) {
                        var finded = false;
                        for (var u in users) {
                            if (users[u].dbdata._id.toString() === d.user.dbdata._id.toString()) {
                                socket.user = users[u];
                                console.log('finded');
                                finded = true;
                                break
                            }
                        }
                        if (!finded) {
                            socket.user = d.user;
                            users.push(socket.user);
                        }
                        bindcommands(socket);
                        var userdata = socket.user.minimize();
                        userdata.sessionid = socket.user.dbdata.sessionid;
                        callback({user: userdata});
                    } else {
                        callback({error: 'badsession'});
                    }
                } else {
                    callback({error: 'badsession'});
                }
            });
        }
        if (data.t) {
            if (debug) {
                db.getUser({_id: '1566736261'}, function(data) {
                    console.log(data);
                    if (data.user) {
                        socket.user = data.user;
                        users.push(socket.user);
                        bindcommands(socket);
                        callback({user: socket.user.minimize()});
                    }
                });
            } else {
                var opt = {
                    host: 'ulogin.ru',
                    port: 80,
                    path: '/token.php?host=http://birdlab.ru&token=' + data.t
                };
                http.get(opt,function(res) {
                    if (res.statusCode == 200) {
                        var str = '';
                        res.on('data', function(chunk) {
                            console.log(chunk);
                            str += chunk;
                        });

                        res.on('end', function() {
                            console.log(str);
                            if (str.length) {
                                var parsedData = JSON.parse(str);
                                console.log('parsed from ulogin - ', parsedData);
                                if (parsedData.uid) {
                                    db.getSocialUser(parsedData, function(data) {
                                        if (data) {
                                            if (data.newuser) {
                                                socket.on('signup', function(data, callback) {
                                                    console.log(data);
                                                    if (data.n) {
                                                        parsedData.name = data.n;
                                                        db.createNewUser(parsedData, function(d) {
                                                            if (d.user) {
                                                                socket.user = d.user;
                                                                users.push(socket.user);
                                                                socket.user.setSessionId(socket);
                                                                socket.user.save();
                                                                bindcommands(socket);
                                                                var userdata = socket.user.minimize();
                                                                userdata.sessionid = socket.user.dbdata.sessionid;
                                                                callback({user: userdata, systemdata: systemdata()});
                                                            }

                                                        });
                                                    }
                                                });
                                                callback({newuser: parsedData.first_name + ' ' + parsedData.last_name});
                                            }
                                            if (data.user) {
                                                var finded = false;
                                                for (var u in users) {
                                                    if (users[u].dbdata._id.toString() === data.user.dbdata._id.toString()) {
                                                        socket.user = users[u];
                                                        console.log('finded');
                                                        finded = true;
                                                        break
                                                    }
                                                }
                                                if (!finded) {
                                                    socket.user = data.user;
                                                    users.push(socket.user);
                                                }
                                                socket.user = data.user;
                                                socket.user.setSessionId(socket);
                                                socket.user.save();
                                                users.push(socket.user);
                                                bindcommands(socket);
                                                var userdata = socket.user.minimize();
                                                userdata.sessionid = socket.user.dbdata.sessionid;
                                                callback({user: userdata, systemdata: systemdata()});
                                            }
                                        }
                                    });

                                }
                            } else {
                                callback({error: str});
                            }


                        });

                    } else {
                        console.log(res);
                        callback({error: res});
                    }
                }).on('error', function(e) {
                        console.log('error - ', e);
                        callback({error: e.message});
                    });
            }

        }
    });


    socket.on('disconnect', function() {
        removeUser(socket.user);
        removeSocket(socket);
    });
});
