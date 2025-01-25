const express = require('express');
const router = express.Router();
const Train = require('../models/Train');

// Show input form
router.get('/', (req, res) => {
  res.render('input');
});

// Process input and generate output
router.post('/train_output', async (req, res) => {
  const { source, destination, date } = req.body;

  // Generate random train data
  const randomTrainData = Array.from({ length: 5 }, () => ({
    trainName: `Train-${Math.floor(10000 + Math.random() * 90000)}`,
    time: `${Math.floor(Math.random() * 24)
      .toString()
      .padStart(2, '0')}:${Math.floor(Math.random() * 60)
      .toString()
      .padStart(2, '0')}`,
    price: Math.floor(Math.random() * 500) + 100,
  }));

  // Save the generated data to MongoDB
  const trainData = new Train({
    source,
    destination,
    date,
    trains: randomTrainData,
  });
  await trainData.save();

  // Render the output page
  res.render('train_output', { source, destination, date, trains: randomTrainData });
});

module.exports = router;
