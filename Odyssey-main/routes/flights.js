const express = require('express');
const router = express.Router();

// Sample local flight data
const flightData = [
    {
        id: 1,
        airline: "Air India",
        flightNumber: "AI-202",
        origin: "Delhi",
        destination: "Mumbai",
        departureTime: "2024-11-28T10:00:00",
        arrivalTime: "2024-11-28T12:30:00",
        price: 4500,
    },
    {
        id: 2,
        airline: "IndiGo",
        flightNumber: "6E-101",
        origin: "Mumbai",
        destination: "Bangalore",
        departureTime: "2024-11-28T15:00:00",
        arrivalTime: "2024-11-28T17:30:00",
        price: 3000,
    },
    {
        id: 3,
        airline: "SpiceJet",
        flightNumber: "SG-302",
        origin: "Kolkata",
        destination: "Chennai",
        departureTime: "2024-11-29T09:00:00",
        arrivalTime: "2024-11-29T11:30:00",
        price: 3500,
    },
];

// Route to display the flight search form
router.get('/flights', (req, res) => {
    res.render('flights', { flights: [] }); // Initial empty flights list
});

// Route to handle search requests
router.post('/flights/search', (req, res) => {
    const { origin, destination, date } = req.body;

    // Filter flights based on user input
    const filteredFlights = flightData.filter(
        (flight) =>
            flight.origin.toLowerCase() === origin.toLowerCase() &&
            flight.destination.toLowerCase() === destination.toLowerCase() &&
            flight.departureTime.startsWith(date)
    );

    res.render('flights', { flights: filteredFlights });
});

module.exports = router;
