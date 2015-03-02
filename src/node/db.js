/**
 * Created by Bird on 28.02.15.
 */
var options = require('./options.json');
var mongoClient = require('mongodb').MongoClient;

var db = null;

mongoClient.connect('mongodb://127.0.0.1:27017/tactris', function(err, dbinstance) {
    if (err) {
        throw err;
    }
    console.log('db connected');
    db = dbinstance;
})