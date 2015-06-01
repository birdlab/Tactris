/**
 * Created by Bird on 28.02.15.
 */
var options = require('./options.json');
var mongoClient = require('mongodb').MongoClient;
var sanitizer = require('sanitizer');
var User = require('./user.js').User;

var db = null;
var path = 'mongodb://' + options.db.user + ':' + options.db.pass + '@' + options.db.host + ':' + options.db.port + '/' + options.db.db
console.log(path);

mongoClient.connect(path, function(err, dbinstance) {
    if (!err) {
        console.log('mongo connected');
        db = dbinstance.db('tactris');
    }
    console.log('error - ', err);
});
exports.getSocialUser = function(data, callback) {
    var collection = db.collection('user');
    if (db) {

        if (data.uid) {
            collection.findOne({network: data.network, uid: data.uid}, function(err, docs) {
                console.log(docs);
                if (docs) {
                    var user = new User(docs);
                    callback({'user': user});
                } else {
                    callback({newuser: true});
                }

            });
        } else {
            callback({error: 'aouth fail'});
        }

    } else {
        callback({error: 'db fail'});
    }
}
exports.getSessionUser = function(data, callback) {
    if (db) {
        var collection = db.collection('user');

        collection.findOne({sessionid: data}, function(err, docs) {
            if (docs) {
                var user = new User(docs);
                callback({'user': user});

            } else {
                callback({error: {message: 'notfound', code: 404}});
            }

        });
    } else {
        callback({error: 'db fail'});
    }
}
exports.getUser = function(data, callback) {
    if (db) {
        var collection = db.collection('user');

        collection.findOne({uid: data._id}, function(err, docs) {
            if (docs) {
                var user = new User(docs);
                callback({'user': user});

            } else {
                callback({error: {message: 'notfound', code: 404}});
            }

        });
    } else {
        callback({error: 'db fail'});
    }
}

exports.getLeaderboard = function(data, callback) {
    if (db) {
        var collection = db.collection('user');
        var searching = {hiscore: {$gte: 10}};
        var sorting = {hiscore: -1};
        console.log('db get leaders - ', data);
        if (data.type == 'hiscore') {
            searching = {hiscore: {$gte: 10}};
            sorting = {hiscore: -1};
        }
        if (data.type == 'exp') {
            searching = {exp: {$gte: 10}};
            sorting = {exp: -1};
        }


        collection.find(searching, {fields: {_id: 1, name: 1, hiscore: 1}}).sort(sorting).limit(100).toArray(function(err, docs) {
            if (docs) {
                callback(docs);
            } else {
                callback({error: {message: 'notfound', code: 404}});
            }

        });
    } else {
        callback({error: 'db fail'});
    }
}

exports.getHiScorePlace = function(data, callback) {
    if (db) {
        var collection = db.collection('user');
        collection.find({hiscore: {$gte: data.score}}).count(function(err, docs) {
            console.log('docs ', docs);
            if (docs) {
                callback(docs);
            } else {
                callback({error: {message: 'notfound', code: 404}});
            }

        });
    } else {
        callback({error: 'db fail'});
    }
}

exports.saveUser = function(data, callback) {
    if (db) {

        var collection = db.collection('user');

        if (data) {
            var st = collection.update({_id: data._id}, data, function(err, docs) {
                if (docs) {
                    callback({ok: true});
                } else {
                    callback({error: err});
                }

            });
            console.log(st);
        }

    } else {
        callback({error: 'db fail'});
    }
}

exports.createNewUser = function(data, callback) {
    if (db) {
        if (data.uid) {
            var collection = db.collection('user');
            collection.find({name: data.name}, function(err, docs) {
                console.dir(docs);
                var user = {
                    name: data.name,
                    profile: data.profile,
                    uid: data.uid,
                    network: data.network,
                    regdate: new Date()
                }
                collection.insert(user, function(err, docs) {
                    console.dir('inserting - ', docs);
                    if (docs[0]) {
                        var newuser = new User(docs[0]);
                        callback({'user': newuser});
                    } else {
                        callback({'error': err});
                    }
                });

            });
        } else {
            callback({error: 'aouth fail'});
        }
    } else {
        callback({error: 'db fail'});
    }
}
exports.getLastGame = function(data, callback) {
    callback({error: {code: 404}});
}


