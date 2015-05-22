var io = require('socket.io')(40040);
var http = require('http');
var options = require('./options.json');
var db = require('./db.js');
var User = require('./user.js').User;
//var PGame = require('./personalgame.js').Game;
var SharedGame = require('./sharedgame.js').Game;
var games = [];
var users = [];
var debug = false;


var bindcommands = function(socket) {
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
            games.push(game);
            game.addPlayer(socket, callback);
        }

        if (data.gt == 'open') {
            if (games.length) {
                for (var g in games) {
                    if (games[g].users.length < 4) {
                        games[g].addPlayer(socket, callback);
                        break;
                    } else {
                        createshared();
                    }

                }

            } else {
                createshared();
            }
        }
    });

}

var removeUser = function(user) {
    setTimeout(function() {
        if (user) {
            for (var u in users) {
                if (user.dbdata._id.toString() ===  users[u].dbdata._id.toString()) {
                    users.splice(u, 1);
                }
            }
        }
    }, 15000);
}

io.on('connection', function(socket) {

    console.log('socket', socket.id, 'connected');


    socket.on('login', function(data, callback) {
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
                                                        // console.log('new user - ', d.user);
                                                        if (d.user) {
                                                            socket.user = d.user;
                                                            users.push(socket.user);
                                                            bindcommands(socket);
                                                            callback({user: socket.user.minimize()});

                                                        }

                                                    });
                                                }
                                            });
                                            callback({newuser: parsedData.first_name + ' ' + parsedData.last_name});
                                        }
                                        if (data.user) {

                                            //   var finded = false;
                                            //   for (var u in users) {
                                            //      if (data.user.minimize() == users[u].minimize()) {
                                            //          data.user = users[u];
                                            //           finded = true;
                                            //           break;
                                            //      }
                                            // }
                                            // if (!finded) {
                                           // users.push(socket.user);
                                            //  }
                                            socket.user = data.user;

                                            bindcommands(socket);
                                            callback({user: socket.user.minimize()});
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
        if (socket.currentGame) {
            removeUser(socket.user);
            socket.currentGame.removePlayer(socket, function() {
            });
        }
    });
});
