const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  trains: [{
    trainName: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
  }],
});

const Train = mongoose.model('Train', trainSchema);
module.exports = Train;
