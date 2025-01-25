const express = require('express');
const router = express.Router();

router.get('/train_ip_form', (req, res) => {
    res.render('train_ip_form', { errors: [] });
});

router.post('/train_form_submission', (req, res) => {
    const errors = [];
    const { field1, field2 } = req.body;

    // Validate input fields
    if (!field1) errors.push({ msg: 'Field1 is required' });
    if (!field2) errors.push({ msg: 'Field2 is required' });

    if (errors.length > 0) {
        return res.render('train_ip_form', { errors });
    }

    res.redirect('/success');
});

router.post('/train_output', (req, res) => {
    const { source, destination, date } = req.body;
    const errors = [];

    // Validation checks
    if (!source) errors.push({ msg: 'Source is required' });
    if (!destination) errors.push({ msg: 'Destination is required' });
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push({ msg: 'Valid date in YYYY-MM-DD format is required' });
    }

    if (errors.length > 0) {
        return res.render('train_ip_form', { errors, source, destination, date });
    }

    res.redirect('/success');
});

module.exports = router;
