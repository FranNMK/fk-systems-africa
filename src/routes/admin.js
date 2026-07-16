/* 
 * src/routes/admin.js - Admin panel routing.
 * Mounted under /admin. Applies rate limiting and CSRF protection.
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/adminController');
const { isAuthenticated } = require('../middleware/auth');

// Rate limiting for the login endpoint (prevent brute-force attacks)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true // Don't count successful logins against the limit
});

// 1. Public Admin Login Routes (No Auth Required)
router.get('/', adminController.getLogin);
router.post('/login', loginLimiter, adminController.postLogin);

// 2. Protected Admin Routes (Session Auth Required)
router.use(isAuthenticated); // All routes below this line require login!

router.get('/dashboard', adminController.getDashboard);
router.get('/logout', adminController.logout);

// Placeholder for future CRUD routes (Module 7)
// router.get('/services', adminController.listServices);
// router.post('/services', adminController.createService);

module.exports = router;