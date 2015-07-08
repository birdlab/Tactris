/**
 * Created by Bird on 08.07.15.
 */
function Chat(data) {
    if (data.game){
        this.game=data.game;
    }
    this.log = new Array();
}
Chat.prototype.broadcastMessage = function(message) {
    for (var s in this.game.sockets){
        var socket=this.game.sockets[s];
        socket.emit('chatmessage', message);
    }
}

Chat.prototype.postMessage = function(data) {
    var message = {'m':data.m, name:data.name, 'uid':data.uid};
    this.log.push(message);
    console.log(message);
    this.broadcastMessage(message);
}


exports.Chat = Chat;