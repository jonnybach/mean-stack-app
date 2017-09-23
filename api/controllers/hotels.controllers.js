var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {

    var lat = parseFloat(req.query.lat);
    var long = parseFloat(req.query.long);

    // Validate query params
    if (isNaN(lat) || isNaN(long)) {
        res
            .status(400)
            .json({
                "message": "If supplied in query string, lat and long should be floats."
            });
        return;
    }

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
            if (err) {
                console.log('Error finding hotels using geo location')
                res
                    .status(500)
                    .json(err);
            } else {
                res
                    .status(200)
                    .json(results);
            }
        });

};

module.exports.hotelsGetAll = function(req, res) {

    var offset = 0;
    var count = 5;
    var maxCount = 10;

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

    // Validate query params
    if (isNaN(offset) || isNaN(count)) {
        res
            .status(400)
            .json({
                "message": "If supplied in query string, offset and count should be integers."
            });
        return;
    }

    if (count > maxCount) {
        res
            .status(400)
            .json({
                'message': 'Count limit of ' + maxCount + " exceeded"
            });
        return;
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels) {
            if (err) {
                console.log('Error finding hotels');
                res
                    .status(500)
                    .json(err);
            } else {
                console.log('Found hotels', hotels.length);
                res
                    .status(200)
                    .json(hotels);
            }
        });

};

module.exports.hotelsGetOne = function(req, res) {

    var hotelId = req.params.hotelId;
    console.log("GET the hotel id " + hotelId);

    Hotel
        .findById(hotelId)
        .exec(function(err, doc) {

            var response = {
                'status': 200,
                'message': doc
            };

            if (err) {
                console.log('Error finding a hotel');
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                console.log('Hotel id not found in database: ', id);
                response.status = 404;
                response.message = {
                    message: 'Hotel ID not found ' + hotelId
                };
            }

            res
                .status(response.status)
                .json(response.message);

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