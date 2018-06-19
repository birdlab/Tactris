/**
 * Created by Bird on 24.02.16.
 */


var connection = require('./db.local.js').connection;
var User = require('./user.js').User;



exports.regUser = function(data, callback) {
    if (connection) {

        if (data.uid) {
            connection.query('SELECT * FROM user WHERE network = \'' + db.connection.escape(data.network) +  ' AND ' + db.connection.escape(data.content), function (e, result, fields) {
                if (!e) {
                    if (result[0]) {
                        var user = new User(result[0]);
                        callback({'user': user});
                    } else {
                        callback({error: 'no such user'});
                    }
                } else {
                    callback({error: 'db fail'});
                }
            });

        } else {
            callback({error: 'aouth fail'});
        }

    } else {
        callback({error: 'db fail'});
    }
};

exports.saveUser = function(data, callback) {
    if (connection) {

        if (data) {
            console.log(data)
            callback({ok: true});

        }

    } else {
        callback({error: 'db fail'});
    }
};

exports.getHiScorePlace = function(data, callback){
    if (connection) {

        if (data) {
            console.log(data)
            callback({ok: true});

        }

    } else {
        callback({error: 'db fail'});
    }
}

exports.getSocialUser = function(data, callback) {
    if (connection) {

        if (data) {
            console.log(data)
            callback({ok: true});

        }

    } else {
        callback({error: 'db fail'});
    }
};

