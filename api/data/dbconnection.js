/*  example of using native mongodb library to connect to database */
var mongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanhotel';

var _connection = null;

var open = function() {
    //set _connection
    mongoClient.connect(dburl, function(err, db) {
        if (err) {
            console.log("DB connection failed");
            return;
        }
        _connection = db;
        console.log("DB connection open", db);
    });
};

var get = function() {
    return _connection;
};

module.exports = {
    open: open,
    get: get
};