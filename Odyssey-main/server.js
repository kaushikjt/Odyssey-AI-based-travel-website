// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const trainRoutes = require('./routes/trainRoutes'); // Ensure trainRoutes is defined

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configure session management
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true if using HTTPS
            maxAge: 1000 * 60 * 60 * 24, // One-day cookie expiration
        },
    })
);

// Mongoose configuration
mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/home', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('home', { user: req.session.user });
});

app.get('/entry', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('entry');
});

app.get('/input', (req, res) => {
    res.render('input'); // Render the input view on /input route
});

app.use('/', trainRoutes);

// Signup Routes
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ success: true, message: 'Signup successful! Redirecting to login...' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'An error occurred during signup.' });
    }
});

// Login Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        // Store user data in session
        req.session.user = user;

        // Redirect to home page after successful login
        return res.redirect('/home');
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ success: false, message: 'An error occurred during login.' });
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.redirect('/home');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

// Flight and Hotel Search Routes
app.get('/flightSearchForm', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Pune'];
    res.render('flightSearchForm', { cities });
});

app.post('/searchFlights', (req, res) => {
    const { departure, arrival, departureDate } = req.body;
    const arrivalDate = new Date(departureDate);
    arrivalDate.setDate(arrivalDate.getDate() + 1);

    const airlines = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet'];
    const flights = Array.from({ length: 5 }, () => ({
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        price: Math.floor(Math.random() * 5000 + 25000),
        departure,
        arrival,
        departureDate,
        arrivalDate: arrivalDate.toISOString().split('T')[0],
        departureTime: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        arrivalTime: `${Math.floor(Math.random() * 12 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
    }));

    res.render('flightResults', { flights, departure, arrival, departureDate, arrivalDate });
});

// Hotel Search Route
app.get('/hotelsSearchForm', (req, res) => {
    res.render('hotelsSearchForm');
});

app.post('/searchHotels', (req, res) => {
    const { location, checkInDate, checkOutDate } = req.body;

    // For simplicity, generating mock hotel data
    const hotels = Array.from({ length: 5 }, () => ({
        name: `Hotel ${Math.floor(Math.random() * 100) + 1}`,
        location,
        checkInDate,
        checkOutDate,
        pricePerNight: Math.floor(Math.random() * 3000 + 1000),
        amenities: ['Free WiFi', 'Swimming Pool', 'Gym', 'Restaurant'],
        rating: (Math.random() * 5).toFixed(1),
    }));
    res.render('hotelResults', { 
        hotels, 
        destination: location, 
        checkinDate, 
        checkoutDate, 
        numberOfGuests 
    });
    
});

// Destination Pages (Static)
['delhi', 'karnataka', 'kerala', 'goa', 'maharastra', 'himachal'].forEach(destination =>
    app.get(`/${destination}`, (req, res) => res.render(destination))
);

// Train Information Routes
app.get('/train_ip_form', (req, res) => {
    res.render('train_ip_form', {
        errors: [],
        source: '',
        destination: '',
        date: '' // Add `date` with a default value
    });
});

app.get('/train_output', (req, res) => {
    res.render('train_output');
});

app.get('/blog', (req, res) => {
    res.render('blog');
});

app.get('/vr', (req, res) => {
    res.render('vr');
});

// Error handling (404 and Server Errors)
app.use((req, res) => {
    res.status(404).render('404', { message: 'The page you are looking for does not exist.' });
});

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ success: false, message: 'An internal server error occurred.' });
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
