var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {

    var lat = parseFloat(req.query.lat);
    var long = parseFloat(req.query.long);

    // geoJSON point
    var point = {
        type: "Point",
        coordinates: [long, lat]
    };

    var geoOptions = {
        spherical: true,
        maxDistance: 2000,
        num: 5
    };

    Hotel
        .geoNear(point, geoOptions, function(err, results, stats) {
            console.log('Geo results', results);
            console.log('Geo stats', stats);
            res
                .status(200)
                .json(results)
        });

};

module.exports.hotelsGetAll = function(req, res) {

    var offset = 0;
    var count = 5;

    if (req.query && req.query.lat && req.query.long) {
        runGeoQuery(req, res);
        return;
    }

    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels) {
            console.log('Found hotels', hotels.length);
            res
                .status(200)
                .json(hotels);
        });

};

module.exports.hotelsGetOne = function(req, res) {

    var hotelId = req.params.hotelId;
    console.log("GET the hotel id " + hotelId);

    Hotel
        .findById(hotelId)
        .exec(function(err, doc) {
            res
                .status(200)
                .json(doc);
        });
};

module.exports.hotelsAddOne = function(req, res) {

    var db = dbconn.get();
    var collection = db.collection('hotels');

    console.log("POST new hotel");
    console.log(req.body);

    if (req.body && req.body.name && req.body.stars ) {
        // store in database
        var newHotel = req.body;
        newHotel.stars = parseInt(newHotel.stars, 10);
        collection.insertOne(newHotel, function(err, response) {
            console.log(response);
            console.log(response.ops);
            res
                .status(201)
                .json(response.ops);
        });

    } else {
        // invalid
        console.log('Data missing from body');
        res
            .status(400)
            .json({message: 'Required data missing from body'});
    }

};