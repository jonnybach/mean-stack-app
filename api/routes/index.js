var express = require('express');
var router = express.Router();

var ctlrHotels = require('../controllers/hotels.controllers');
var ctlrReviews = require('../controllers/reviews.controllers');


//Hotels routes

router
    .route('/hotels')
    .get(ctlrHotels.hotelsGetAll);

router
    .route('/hotels/:hotelId')
    .get(ctlrHotels.hotelsGetOne);

router
    .route('/hotels/new')
    .post(ctlrHotels.hotelsAddOne);


//Reviews routes

router
    .route('/hotels/:hotelId/reviews')
    .get(ctlrReviews.reviewsGetAll);

router
    .route('/hotels/:hotelId/reviews/:reviewId')
    .get(ctlrReviews.reviewsGetOne);


module.exports = router;