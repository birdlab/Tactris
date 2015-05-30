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
    //   db.getHiScorePlace({score:1000},function(data){console.log(data)});

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
        if (socket.user) {
            if (socket.user.dbdata._id.toString() === "555e90116e88debb335b91cd") {
                console.log('Рестарт сервера через 2 секунды');
                if (data.reason) {
                    console.log(data.reason);
                }
                setTimeout(function() {
                    process.exit();
                }, 2000);
            }
        }
    })
    socket.on('getleaderboard', function(data, callback) {
        if (data.type) {
            db.getLeaderboard({type: data.type}, callback);
        }
    })
    socket.on('blur', function() {
        if (socket.currentGame) {
            socket.currentGame.blurUser(socket);
        }
    })
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
        console.log(data);
        var createshared = function() {
            var game = new SharedGame({dim: 10});
            opengames.push(game);
            game.addPlayer(socket, callback);
            for (var p in waitforshared) {
                if (game.sockets.length < 4) {
                    var playerdata = waitforshared.unshift();
                    game.addPlayer(playerdata.so, playerdata.call);
                }
            }
        }
        var createpersonal = function() {
            var game = new SharedGame({dim: 10, personal: true});
            games.push(game);
            game.addPlayer(socket, callback);
        }
        if (data.gt == 'personal') {
            createpersonal();
        }
        if (data.gt == 'newopen') {
            createshared();
        }
        if (data.gt == 'open') {
            var finded = false;
            if (opengames.length) {
                var freeslots = [];
                for (var g in opengames) {
                    if (opengames[g].sockets.length < 4) {
                        freeslots.push(opengames[g]);
                    }
                }
                if (freeslots.length) {
                    freeslots = sortByActivity(freeslots);
                    freeslots[0].addPlayer(socket, callback);
                    finded = true;
                }
            }
            if (!finded) {
                createshared();
                // waitforshared.push({so: socket, call: callback});
            }

        }
    });

}

var removeUser = function(user) {
    setTimeout(function() {
        if (user) {
            for (var u in users) {
                if (user == users[u]) {
                    users.splice(u, 1);
                }
            }
        }
    }, 15000);
}

io.on('connection', function(socket) {

    console.log('socket', socket.id, 'connected');

    socket.on('systeminfo', function(callback) {
        callback(systemdata());
    });

    socket.on('login', function(data, callback) {
        if (data.s) {
            db.getSessionUser(data.s, function(d) {
                if (d.user) {
                    if (d.user.getSessionId(socket) === data.s) {
                        socket.user = d.user;
                        users.push(socket.user);
                        bindcommands(socket);
                        var userdata= socket.user.minimize();
                        userdata.sessionid=socket.user.dbdata.sessionid;
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
                    host: '46.165.246.208',
                    port: 80,
                    path: '/token.php?host=http://birdlab.ru&token=' + data.t
                };
                http.get(opt,function(res) {
                    //  console.log(res.statusCode);
                    if (res.statusCode == 200) {
                        res.on('data', function(chunk) {
                            var parsedData = JSON.parse(chunk);
                            //   console.log('parsed from ulogin - ', parsedData);
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
                                                            socket.user.setSessionId(socket);
                                                            socket.user.save();
                                                            users.push(socket.user);
                                                            bindcommands(socket);
                                                            var userdata= socket.user.minimize();
                                                            userdata.sessionid=socket.user.dbdata.sessionid;
                                                            callback({user: userdata, systemdata: systemdata()});
                                                        }

                                                    });
                                                }
                                            });
                                            callback({newuser: parsedData.first_name + ' ' + parsedData.last_name});
                                        }
                                        if (data.user) {
                                            socket.user = data.user;
                                            socket.user.setSessionId(socket);
                                            socket.user.save();
                                            users.push(socket.user);
                                            bindcommands(socket);
                                            var userdata= socket.user.minimize();
                                            userdata.sessionid=socket.user.dbdata.sessionid;
                                            callback({user: userdata, systemdata: systemdata()});
                                        }
                                    }
                                });

                            }


                        });

                    } else {
                        callback({error: res.statusCode});
                    }
                }).on('error', function(e) {
                        console.log('error - ', e);
                        callback({error: e.message});
                    });
                console.log('request', opt, 'sended...');
            }

        }
    });


    socket.on('disconnect', function() {
        removeUser(socket.user);
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
                            }
                        }

                    }
                }
            });
        }
    });
});
