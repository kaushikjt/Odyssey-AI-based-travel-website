const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: String,
    flightNumber: String,
    departure: String,
    destination: String,
    departureTime: Date,
    arrivalTime: Date,
    price: Number,
});

module.exports = mongoose.model('Flight', flightSchema);
