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

var _splitArray = function(input) {
    var output;
    if (input && input.length > 0) {
        output = input.split(';');
    } else {
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function(req, res) {

    Hotel
        .create({
            name: req.body.name,
            description: req.body.description,
            stars: parseInt(req.body.stars, 10),
            services: _splitArray(req.body.services),
            photos: _splitArray(req.body.photos),
            currency: req.body.currency,
            location: {
                address: req.body.address,
                coordinates: [
                    parseFloat(req.body.long),
                    parseFloat(req.body.lat)
                ]
            }
        }, function(err, hotel) {
            if (err) {
                console.log('Error creating hotel');
                res
                    .status(400)
                    .json(err);
            } else {
                console.log('Hotel created ', hotel);
                res
                    .status(201)
                    .json(hotel);
            }
        });

};

module.exports.hotelsUpdateOne = function(req, res) {

    var hotelId = req.params.hotelId;
    console.log("GET the hotel id " + hotelId);

    Hotel
        .findById(hotelId)
        .select('-reviews -rooms')
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

            if (response.status != 200) {
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                // Update returned hotel document with form data
                doc.name = req.body.name;
                doc.description = req.body.description;
                doc.stars = parseInt(req.body.stars, 10);
                doc.services = _splitArray(req.body.services);
                doc.photos = _splitArray(req.body.photos);
                doc.currency = req.body.currency;
                doc.location = {
                    address: req.body.address,
                    coordinates: [
                        parseFloat(req.body.long),
                        parseFloat(req.body.lat)
                    ]
                };

                doc.save(function(err, hotelUpdated) {
                    if (err) {
                        res
                            .status(500)
                            .json(err);
                    } else {
                        res
                            .status(204)
                            .json();
                    }
                })

            }
        });
};