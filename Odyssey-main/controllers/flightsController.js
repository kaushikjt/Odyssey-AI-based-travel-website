const axios = require('axios');

// Render the flight search form
exports.renderFlightForm = (req, res) => {
    res.render('flightSearchForm', { flightDetails: null, error: null });
};

// Handle flight search request
exports.searchFlights = async (req, res) => {
    const { flightNumber, date } = req.body;
    const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
    const API_URL = `https://api.example.com/flights?flightNumber=${flightNumber}&date=${date}&apiKey=${API_KEY}`;

    try {
        const response = await axios.get(API_URL);
        const flightDetails = response.data;
        res.render('flightSearchForm', { flightDetails, error: null });
    } catch (error) {
        console.error('Error fetching flight details:', error.message);
        res.render('flightSearchForm', {
            flightDetails: null,
            error: 'Unable to fetch flight details. Please try again later.',
        });
    }
};
