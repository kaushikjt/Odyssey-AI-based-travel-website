const express = require('express');
const router = express.Router();

// Home Page Route
router.get('/', (req, res) => {
    res.render('index');
});

// Car Rental Route
router.get('/car-rental', (req, res) => {
    res.render('carRental');
});

// Flights Page Route
router.get('/flights', (req, res) => {
    res.render('flights');
});

// Stays Page Route
router.get('/stays', (req, res) => {
    res.render('stays');
});

// Flight and Hotel Bundle Route
router.get('/flight-hotel', (req, res) => {
    res.render('flightHotel');
});

// Explore Page Route
router.get('/explore', (req, res) => {
    res.render('explore');
});

module.exports = router;
