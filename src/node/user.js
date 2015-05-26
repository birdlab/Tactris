var db = require('./db.js');

function User(data) {
    this.dbdata = data;
    this.dbdata.exp = data.exp || 0;
    this.dbdata.hiscore = data.hiscore || 0;
    this.dbdata.totalgames = data.totalgames || 0;
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
        profile: this.dbdata.profile,
        regdate: this.dbdata.regdate,
        exp: this.dbdata.exp,
        hiscore: this.dbdata.hiscore
    }
    return obj;
}

exports.User = User;