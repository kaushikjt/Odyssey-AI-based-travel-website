const express = require('express'); // Ensure this line is present and correct

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const User = require('./models/User');

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define routes
app.get('/home', (req, res) => {
    res.render('home'); // Render the home page
});

app.get('/entry', (req, res) => {
    res.render('entry');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });

    try {
        await user.save();
        res.redirect('/login'); // Redirect to login page after successful signup
    } catch (error) {
        console.error(error);
        res.redirect('/signup'); // Redirect back to signup if there's an error
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        // Passwords match, login successful
        res.redirect('/entry'); // Redirect to entry page or dashboard
    } else {
        res.redirect('/login'); // Redirect back to login if there's an error
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
