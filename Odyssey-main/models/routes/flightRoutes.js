const express = require('express');
const router = express.Router();
const amadeus = require('amadeus');

const amadeusClient = new amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID,
    clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

// Flight Search Form
router.get('/flightSearchForm', (req, res) => {
    res.render('flightSearchForm');
});

// Fetch Flights
router.get('/flights', async (req, res) => {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
        return res.status(400).render('404', { message: 'Missing search parameters!' });
    }

    try {
        const response = await amadeusClient.shopping.flightOffersSearch.get({
            originLocationCode: origin,
            destinationLocationCode: destination,
            departureDate: date,
            adults: 1,
            currencyCode: 'INR',
        });

        res.render('flights', { flights: response.data });
    } catch (error) {
        console.error('Error fetching flight details:', error.message);
        res.status(500).render('404', { message: 'Failed to fetch flight details.' });
    }
});

module.exports = router;
