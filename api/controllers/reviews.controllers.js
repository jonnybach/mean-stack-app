var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(req, res) {

    var hotelId = req.params.hotelId;
    console.log("GET the hotel id " + hotelId);

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, doc) {

            var response = {
                'status': 200,
                'message': []
            };

            if (err) {
                console.log('Error finding hotel');
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                console.log('Hotel id not found in database: ', id);
                response.status = 404;
                response.message = {
                    message: 'Hotel ID not found ' + hotelId
                };
            } else {
                response.message = doc.reviews ? doc.reviews : [];
            }

            res
                .status(response.status)
                .json(response.message);
        });
};

module.exports.reviewsGetOne = function(req, res) {

    var hotelId = req.params.hotelId;
    console.log("GET the hotel id " + hotelId);

    var reviewId = req.params.reviewId;
    console.log("GET the review id " + reviewId);

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel) {

            var response = {
                'status': 200,
                'message': {}
            };

            if (err) {
                console.log('Error finding hotel');
                response.status = 500;
                response.message = err;
            } else if (!hotel) {
                console.log('Hotel id not found in database: ', id);
                response.status = 404;
                response.message = {
                    message: 'Hotel ID not found ' + hotelId
                };
            } else {
                //Hotel found, get review with id
                var review = hotel.reviews.id(reviewId);
                if (!review) {
                    response.status = 404;
                    response.message = "Review id not found " + reviewId;
                } else {
                    response.message = review
                }
            }

            res
                .status(response.status)
                .json(response.message);
        });

};

var _addReview = function(req, res, hotel) {
    hotel.reviews.push({
        name: req.body.name,
        rating: parseInt(req.body.rating, 10),
        review: req.body.review
    });

    hotel.save(function(err, hotelUpdated) {
        if (err) {
            res
                .status(500)
                .json(err);
        } else {
            res
                .status(201)
                .json(hotelUpdated.reviews[hotelUpdated.reviews.length-1]);
        }
    });

};

module.exports.reviewsAddOne = function(req, res) {

    var hotelId = req.params.hotelId;
    console.log("GET the hotel id " + hotelId);

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, doc) {

            var response = {
                'status': 200,
                'message': []
            };

            if (err) {
                console.log('Error finding hotel');
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                console.log('Hotel id not found in database: ', id);
                response.status = 404;
                response.message = {
                    message: 'Hotel ID not found ' + hotelId
                };
            }

            if (doc) {
                _addReview(req, res, doc);
            } else {
                res
                    .status(response.status)
                    .json(response.message);
            }
        });
};

var _updateReview = function(req, res, hotel, reviewId) {

    //Hotel found, update review with id
    var review = hotel.reviews.id(reviewId);
    if (!review) {
        res
            .status(404)
            .json({
            message: "Review id not found " + reviewId
        });
    } else {
        review.name = req.body.name;
        review.rating = parseInt(req.body.rating, 10);
        review.review =  req.body.review;

        //save updated sub document for the hotel
        hotel.save(function (err, hotelUpdated) {
            if (err) {
                res
                    .status(500)
                    .json(err);
            } else {
                res
                    .status(204)
                    .json();
            }
        });
    }

};

module.exports.reviewsUpdateOne = function(req, res) {

    var hotelId = req.params.hotelId;
    console.log("GET the hotel id " + hotelId);

    var reviewId = req.params.reviewId;
    console.log("GET the review id " + reviewId);

    Hotel
        .findById(hotelId)
        .select('reviews')
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

            if (doc) {
                _updateReview(req, res, doc, reviewId);
            } else {
                res
                    .status(response.status)
                    .json(response.message);
            }

        });
};