var express = require('express');
var router = express.Router();

var ctlrHotels = require('../controllers/hotels.controllers');
var ctlrReviews = require('../controllers/reviews.controllers');


//Hotels routes

router
    .route('/hotels')
    .get(ctlrHotels.hotelsGetAll)
    .post(ctlrHotels.hotelsAddOne);

router
    .route('/hotels/:hotelId')
    .get(ctlrHotels.hotelsGetOne)
    .put(ctlrHotels.hotelsUpdateOne);


//Reviews routes

router
    .route('/hotels/:hotelId/reviews')
    .get(ctlrReviews.reviewsGetAll)
    .post(ctlrReviews.reviewsAddOne);

router
    .route('/hotels/:hotelId/reviews/:reviewId')
    .get(ctlrReviews.reviewsGetOne)
    .put(ctlrReviews.reviewsUpdateOne);


module.exports = router;