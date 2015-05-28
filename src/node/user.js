var db = require('./db.js');

function User(data) {
    this.dbdata = data;
    this.dbdata.exp = data.exp || 0;
    this.dbdata.hiscore = data.hiscore || 0;
    this.dbdata.totalgames = data.totalgames || 0;
    this.dbdata.showsocial = data.showsocial || 0;
}


User.prototype.save = function() {
    console.log('saving', this.dbdata.name);
    db.saveUser(this.dbdata, function(data) {
        console.log('user saved - ', data);
    });
    return this;
}

User.prototype.addXp = function(xpink) {
    this.dbdata.exp = this.dbdata.exp + xpink;
    console.log(this.dbdata.name, ' xp added - ', xpink);
    return this.dbdata.exp;
}

User.prototype.minimize = function() {
    var obj = {
        id: this.dbdata._id.toString(),
        name: this.dbdata.name,
        regdate: this.dbdata.regdate,
        exp: this.dbdata.exp,
        hiscore: this.dbdata.hiscore
    }
    if (this.dbdata.showsocial) {
        obj.profile = this.dbdata.profile;
    }
    return obj;
}

User.prototype.fullData = function(callback) {
    var obj = {
        id: this.dbdata._id.toString(),
        name: this.dbdata.name,
        regdate: this.dbdata.regdate,
        exp: this.dbdata.exp,
        hiscore: this.dbdata.hiscore,
        totalgames: this.dbdata.totalgames,
        overalscore: Math.round(this.dbdata.exp / this.dbdata.totalgames)
    }
    if (callback) {
        db.getHiScorePlace({score: obj.hiscore}, function(data) {
            obj.hiscoreplace = data;
        })
    }
    if (this.dbdata.showsocial) {
        obj.profile = this.dbdata.profile;
    }
    return obj;
}

exports.User = User;