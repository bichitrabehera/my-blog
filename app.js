require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const serverless = require('serverless-http');

const app = express();
const connectDB = require('./server/config/db');

// Connect to DB
connectDB()
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

// Session store
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));

// Static files
app.use(express.static('public'));
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Template Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

// Export as Serverless Function for Vercel
module.exports = app;
module.exports.handler = serverless(app);