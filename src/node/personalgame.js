var db = require('./db.js');

function Game(data, callback) {
    if (data.dim) {
        this.dimention = data.dim;
    }
    this.pole = [];
    for (var y = 0; y < this.dimention; y++) {
        var line = [];
        this.pole.push(line);
        for (var x = 0; x < this.dimention; x++) {
            line.push(0);
        }
    }
    console.log(this.pole);
    this.playersocket = data.player;

    this.bindplayer(this.playersocket);

    callback({status: 'ok', pole: this.pole});
}

Game.prototype.bindplayer = function(player) {
    player.on('move', function(data, callback) {
        console.log(data);
        callback('ok');
    })
}
Game.prototype.save = function() {
    console.log('saving', this.dbdata.name);
    db.saveGame(this.dbdata, function(data) {
        console.log('user saved - ', data);
    });
    return this;
}

exports.Game = Game;
