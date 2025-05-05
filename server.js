const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Set view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('resources'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Route modules
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/video');

app.use('/auth', authRoutes);
app.use('/video', videoRoutes);

// Root route for Glitch to recognize and start the server
app.get('/', (req, res) => {
  res.redirect('/auth/login'); // Adjust this if your login route differs
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
