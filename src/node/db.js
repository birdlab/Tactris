/**
 * Created by Bird on 28.02.15.
 */
var options = require('./options.json');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var objectId = mongodb.ObjectID;
var sanitizer = require('sanitizer');
var User = require('./user.js').User;

var db = null;
//var path = 'mongodb://' + options.db.user + ':' + options.db.pass + '@' + options.db.host + ':' + options.db.port + '/' + options.db.db
var path = 'mongodb://' + options.db.host + ':' + options.db.port + '/' + options.db.db;
console.log(path);

mongoClient.connect(path, function(err, dbinstance) {
    if (!err) {
        console.log('mongo connected');
        db = dbinstance.db('tactris');
    }
    console.log('error - ', err);
});
exports.regUser = function(data, callback) {
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
exports.getMailUser = function(data, callback) {
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
        var req = {};
        if (data._id) {
            req = {uid: data._id}
        }
        if (data.dbid) {
            req = {_id: new objectId(data.dbid)}
        }
        collection.findOne(req, function(err, docs) {
            console.log(err, docs);
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
        if (data.type == 'hioveral') {
            collection.find({hiscore: {$gte: 10}}, {
                fields: {
                    _id: 1,
                    name: 1,
                    hiscore: 1
                }
            }).sort({hiscore: -1}).limit(100).toArray(function(err, docs) {
                if (docs) {
                    callback(docs);
                } else {
                    callback({error: {message: 'notfound', code: 404}});
                }

            });

        } else {
            collection = db.collection('score');
            if (data.type == 'hidaily') {
                var dateshift = new Date(new Date() - 86400000);
            }
            if (data.type == 'hiweek') {
                var dateshift = new Date(new Date() - 604800000);
            }
            if (data.type == 'himounth') {
                var dateshift = new Date(new Date() - 2592000000);
            }


            collection.find({date: {$gt: dateshift}}, {
                fields: {
                    userid: 1,
                    name: 1,
                    score: 1
                }
            }).sort({score: -1}).limit(100).toArray(function(err, docs) {
                if (docs) {
                    callback(docs);
                } else {
                    callback({error: {message: 'notfound', code: 404}});
                }

            });
        }


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
        }

    } else {
        callback({error: 'db fail'});
    }
}
exports.addScore = function(data, callback) {
    if (db) {
        var collection = db.collection('score');
        if (data) {
            collection.insert(data, function(err, docs) {
                if (docs[0]) {
                    callback({'ok': true});
                } else {
                    callback({'error': err});
                }
            });
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
                var user = {
                    name: data.name,
                    profile: data.profile,
                    uid: data.uid,
                    network: data.network,
                    regdate: new Date()
                }
                collection.insert(user, function(err, docs) {
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


