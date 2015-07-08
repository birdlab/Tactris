var db = require('./db.js');
var crypto = require('crypto');

function User(data) {
    this.dbdata = data;
    this.dbdata.exp = data.exp || 0;
    this.dbdata.hiscore = data.hiscore || 0;
    this.dbdata.totalgames = data.totalgames || 0;
    this.dbdata.showsocial = data.showsocial || 0;
    this.dbdata.name = data.name.replace(/<(?:.|\n)*?>/gm, '');
    this.dbdata.color = data.color || Math.random();

}


User.prototype.save = function() {
    console.log('saving', this.dbdata.game);
    if (this.dbdata.game) {
        for (var s in this.dbdata.game.slots) {
            this.dbdata.game.slots[s].free = true;
            this.dbdata.game.slots[s].socket = null;
        }
    }
    db.saveUser(this.dbdata, function(data) {
        console.log('user saved - ', data);
    });
    return this;
}

User.prototype.addXp = function(xpink) {
    this.dbdata.exp = this.dbdata.exp + xpink;
    //console.log(this.dbdata.name, ' xp added - ', xpink);
    return this.dbdata.exp;
}

User.prototype.getSessionId = function(socket) {
    var hash = socket.handshake.headers['x-real-ip'] + this.dbdata._id.toString() + this.dbdata.uid;
    var shasum = crypto.createHash('sha1');
    shasum.update(hash, 'utf8');
    var answer = shasum.digest('hex');
    console.log(answer)
    return answer;
}


User.prototype.setSessionId = function(socket) {
    var hash = socket.handshake.headers['x-real-ip'] + this.dbdata._id.toString() + this.dbdata.uid;
    var shasum = crypto.createHash('sha1');
    shasum.update(hash, 'utf8');
    this.dbdata.sessionid = shasum.digest('hex');
    console.log(this.dbdata.sessionid);
    return this.dbdata.sessionid;
}

User.prototype.minimize = function() {
    var obj = {
        id: this.dbdata._id.toString(),
        name: this.dbdata.name,
        regdate: this.dbdata.regdate,
        exp: this.dbdata.exp,
        color: this.dbdata.color,
        hiscore: this.dbdata.hiscore
    }
    if (this.dbdata.showsocial) {
        obj.profile = this.dbdata.profile;
    }
    return obj;
}

User.prototype.fullData = function(callback, ss) {
    var obj = {
        id: this.dbdata._id.toString(),
        name: this.dbdata.name,
        color: this.dbdata.color,
        regdate: this.dbdata.regdate,
        exp: this.dbdata.exp,
        hiscore: this.dbdata.hiscore,
        totalgames: this.dbdata.totalgames,
        overalscore: Math.round(this.dbdata.exp / this.dbdata.totalgames)
    }
    if (this.dbdata.showsocial || ss) {
        obj.profile = this.dbdata.profile;
    }
    if (callback) {
        db.getHiScorePlace({score: obj.hiscore}, function(data) {
            obj.hiscoreplace = data;
            callback(obj);
        })
    }
    return obj;
}

exports.User = User;