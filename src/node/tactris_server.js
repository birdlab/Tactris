var io = require('socket.io')(40040);
var http = require('http');
var options = require('./options.json');
var db = require('./db.js');


io.on('connection', function(socket) {
    console.log(socket.id, 'connected');
    socket.on('login', function(data, callback) {
        if (data.t) {
            http.get("http://ulogin.ru/token.php?host=http://birdlab.ru/tactris/html5&token=" + data.t,function(res) {
                if (res.statusCode == 200) {
                    res.on('data', function(chunk) {
                        var parsedData = JSON.parse(chunk);
                        db.getSocialUser(parsedData, function(data) {
                            console.log(data);
                        })
                    });
                } else {
                    console.log(res.statusCode);
                    callback({error: res.statusCode});
                }
            }).on('error', function(e) {
                    callback({error: e.message});
                });
        }
    });
    socket.on('disconnect', function() {
    });
});
