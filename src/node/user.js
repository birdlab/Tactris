var db = require('./db.js');

function User(data) {
    console.log('db data - ', data);
    this.dbdata = data;
    this.dbdata.level = data.level || 1;
    this.dbdata.exp = data.exp || 0;
    console.dir('init user', this);
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
    console.log('xp added - ', xpink);
    this.save();
}

User.prototype.minimize = function() {
    var obj = {
        _id: this._id,
        name: this.dbdata.name,
        profile: this.dbdata.profile,
        level: this.dbdata.level,
        regdate: this.dbdata.regdate,
        exp: this.dbdata.exp
    }
    return obj;
}

exports.User = User;