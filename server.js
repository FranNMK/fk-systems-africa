/* 
 * server.js - Entry point for FK Systems Africa.
 * Boots Express, sets up the EJS engine for .html files,
 * initializes the TiDB session store, and connects to the database.
 */

const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const compression = require('compression');
const dbModule = require('./config/db'); // Get the db initialization module
const requestLogger = require('./src/middleware/requestLogger');
const adminRoutes = require('./src/routes/admin'); // Import Admin Routes

const app = express();
const PORT = process.env.PORT || 3000;

// 1. View Engine Configuration (Renders .html files using EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// 2. Middleware
app.use(compression()); // Compress responses for performance
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Serves CSS, JS, Images
app.use(requestLogger); // Adds correlation ID and structured logging to every request

// 3. Initialize Database First - Must happen before session store setup
dbModule.initialize()
  .then(() => {
    // 4. Session Store Setup (Using TiDB/MySQL to store admin sessions)
    const sessionStore = new MySQLStore({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 4000,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      // CRITICAL FIX: Adding SSL to the session store for TiDB Cloud
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : false,
      clearExpired: true,
      checkExpirationInterval: 900000 // 15 minutes
    });

    app.use(session({
      key: 'fk_admin_session',
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // 5. Public Application Routes
    app.get('/', (req, res) => {
      try {
        res.render('public/index', { 
          title: 'FK Systems Africa | Software & AI Solutions',
          description: 'World-class software engineering and AI literacy training in Africa.'
        });
      } catch (err) {
        req.log.error({ err }, 'Failed to render index.html');
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/services', (req, res) => {
      try {
        res.render('public/services', { title: 'Our Services | FK Systems Africa' });
      } catch (err) {
        req.log.error({ err }, 'Failed to render services.html');
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/solutions', (req, res) => {
      try {
        res.render('public/solutions', { title: 'Our Work | FK Systems Africa' });
      } catch (err) {
        req.log.error({ err }, 'Failed to render solutions.html');
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/training', (req, res) => {
      try {
        res.render('public/training', { title: 'Training Programs | FK Systems Africa' });
      } catch (err) {
        req.log.error({ err }, 'Failed to render training.html');
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/events', (req, res) => {
      try {
        res.render('public/events', { title: 'Events | FK Systems Africa' });
      } catch (err) {
        req.log.error({ err }, 'Failed to render events.html');
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/about', (req, res) => {
      try {
        res.render('public/about', { title: 'About Us | FK Systems Africa' });
      } catch (err) {
        req.log.error({ err }, 'Failed to render about.html');
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/contact', (req, res) => {
      try {
        res.render('public/contact', { title: 'Contact Us | FK Systems Africa' });
      } catch (err) {
        req.log.error({ err }, 'Failed to render contact.html');
        res.status(500).send('Internal Server Error');
      }
    });

    // 6. Admin Application Routes
    app.use('/admin', adminRoutes); // Mounts the hidden admin panel at /admin

    // 7. Central Error Handler (Guarded against double-response crashes)
    app.use((err, req, res, next) => {
      req.log.error({ err }, '❌ Unhandled Server Error');
      // If headers are already sent, let Express handle the termination gracefully
      if (res.headersSent) {
        return next(err);
      }
      res.status(500).send('Something broke! Check server logs.');
    });

    // 8. Boot Server
    app.listen(PORT, () => {
      console.log(`🚀 FK Systems Africa server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize database. Exiting.', err.message);
    process.exit(1);
  });

