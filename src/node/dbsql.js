/**
 * Created by Bird on 24.02.16.
 */


var connection = require('./db.local.js').connection;
var User = require('./user.js').User;



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
            console.log(data);
            callback({ok: true});

        }

    } else {
        callback({error: 'db fail'});
    }
}

exports.getSocialUser = function(data, callback) {
    if (connection) {

        if (data) {
            console.log('getting user data from db');
            connection.query('SELECT * FROM user WHERE network = ' + connection.escape(data.network) +  ' AND uid = ' + connection.escape(data.uid), function (e, result, fields) {
                console.log(e);
                if (!e) {
                    console.log(result);
                    if (result[0]) {
                        var user = new User(result[0]);
                        callback({'user': user});
                    } else {
                        console.log('new user');
                        data.name=data.first_name+' '+ data.last_name;
                        data.profile=connection.escape(data.profile);
                        data.uid=connection.escape(data.uid);
                        data.network=connection.escape(data.network);
                        data.identity=connection.escape(data.identity);
                        console.log(data);
                        connection.query('INSERT INTO user (`name`, `profile`, `uid`, `network`) VALUES (' + connection.escape(data.name) + ', ' + data.profile + ', '  + data.uid + ', '  + data.network +')', function (e, result, fields) {
                            console.log(e);
                            console.log(result);
                            if (!e) {

                                var user = new User(data);
                                callback({'user': user});

                            }
                        });
                    }
                } else {
                    callback({error: 'db fail'});
                }
            });

        }

    } else {
        callback({error: 'db fail'});
    }
};

