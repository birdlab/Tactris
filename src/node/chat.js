/**
 * Created by Bird on 08.07.15.
 */

var sanitizer = require('sanitizer');

function Chat(data) {
    if (data.game) {
        this.game = data.game;
    }
    this.log = new Array();
}
Chat.prototype.broadcastMessage = function(message) {
    for (var s in this.game.sockets) {
        var socket = this.game.sockets[s];
        socket.emit('chatmessage', message);
    }
}

Chat.prototype.postMessage = function(data) {
    data.m = data.m.replace(/<(?:.|\n)*?>/gm, '');
    var message = {'m': data.m, name: data.name, 'uid': data.uid};
    this.log.push(message);
    console.log(message);
    this.broadcastMessage(message);
}


exports.Chat = Chat;