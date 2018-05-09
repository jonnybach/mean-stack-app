require('./api/data/db.js');
var express = require('express');
var app = express();
var path = require('path');
var routes = require('./api/routes');
var bodyParser = require('body-parser');

app.set('port', 3000);

// Middleware to console log every request
app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

// Static directory, set before defining routes
app.use(express.static(path.join(__dirname, 'public')));

// Mount node modules middleware
app.use('/node_modules', express.static(__dirname + '/node_modules'))

// Enable parsing of posted forms
app.use(bodyParser.urlencoded({"extended": false}));

// Set up routing
app.use('/api', routes);

// Start listening for requests
var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});
