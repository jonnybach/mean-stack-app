var express = require('express');
var router = express.Router();
var ctlrHotels = require('../controllers/hotels.controllers');

router
    .route('/hotels')
    .get(ctlrHotels.hotelsGetAll);

router
    .route('/hotels/:hotelId')
    .get(ctlrHotels.hotelsGetOne);

router
    .route('/hotels/new')
    .post(ctlrHotels.hotelsAddOne);

module.exports = router;