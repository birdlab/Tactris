var io = require('socket.io')(40040);
var http = require('http');
var options = require('options.json');
var db = require('db');

io.sockets.on('connection', function(socket) {
    console.log(socket + '!! ))');
    ;
    socket.on('login', function(data, callback) {
        if (data.t) {
            http.get("http://ulogin.ru/token.php?host=http://birdlab.ru/tactris/html5&token=" + data.t,function(res) {
                if (res.statusCode == 200) {
                    res.on('data', function(chunk) {
                        console.log('BODY: ' + chunk);
                        var ans = JSON.parse(chunk);
                        console.log(ans);
                    });
                }
            }).on('error', function(e) {
                    console.log("Got error: " + e.message);
                });
        }
    });
});
