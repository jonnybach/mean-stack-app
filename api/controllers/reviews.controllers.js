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
            } else if (!doc) {
                console.log('Hotel id not found in database: ', id);
                response.status = 404;
                response.message = {
                    message: 'Hotel ID not found ' + hotelId
                };
            } else {
                //Hotel found, get review with id
                var review = hotel.reviews.id(reviewId);
                if (!review) {
                    response.status(404);
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