var io = require('socket.io')(40040);

io.sockets.on('connection', function(socket) {
    console.log(socket+ '!! ))');
});