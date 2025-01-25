app.post('/searchHotels', (req, res) => {
    const { checkinDate, checkoutDate, numberOfGuests, location } = req.body;

    // Example hotel data (replace with actual data or API call)
    const hotels = [
        { name: 'Hotel Sunshine', price: 5000, rating: 4.5 },
        { name: 'Grand Palace', price: 7000, rating: 4.8 },
        { name: 'Cozy Inn', price: 3000, rating: 4.2 }
    ];

    // Ensure these variables are passed to the view
    res.render('hotelResults', { 
        hotels, 
        destination, 
        checkinDate, 
        checkoutDate, 
        numberOfGuests 
    });
});
