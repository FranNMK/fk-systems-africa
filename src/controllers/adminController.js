/* 
 * src/controllers/adminController.js - Logic for admin authentication and dashboard.
 */

const dbModule = require('../../config/db');
const bcrypt = require('bcryptjs');
const csrf = require('csrf');

const csrfTokens = new csrf(); // CSRF token generator

// Helper to get db instance
const getDb = () => dbModule.getDb();

module.exports = {
  // GET /admin - Renders login page (or redirects to dashboard if already logged in)
  getLogin: (req, res) => {
    if (req.session && req.session.adminId) {
      return res.redirect('/admin/dashboard');
    }
    
    // Generate a CSRF token for the login form
    const secret = csrfTokens.secretSync();
    const token = csrfTokens.create(secret);
    req.session.csrfSecret = secret; // Store secret in session to validate later

    res.render('admin/login', {
      title: 'Admin Login | FK Systems Africa',
      csrfToken: token,
      returnUrl: req.query.returnUrl || '/admin/dashboard'
    });
  },

  // POST /admin/login - Authenticates the admin
  postLogin: async (req, res) => {
    const { email, password, _csrf } = req.body;
    const returnUrl = req.body.returnUrl || '/admin/dashboard';

    // Validate CSRF token
    if (!req.session.csrfSecret || !csrfTokens.verify(req.session.csrfSecret, _csrf)) {
      return res.status(403).render('admin/login', {
        title: 'Admin Login',
        csrfToken: csrfTokens.create(csrfTokens.secretSync()),
        error: 'Invalid security token. Please refresh the page.',
        returnUrl: returnUrl // FIX: Added missing variable
      });
    }

    try {
      const db = getDb();
      // Find the user by email
      const admin = await db('admins').where('email', email).first();

      if (!admin) {
        req.log.warn({ event: 'admin.login.failed', email }, 'Invalid login attempt - user not found');
        return res.render('admin/login', {
          title: 'Admin Login',
          csrfToken: csrfTokens.create(csrfTokens.secretSync()),
          error: 'Invalid email or password.',
          returnUrl: returnUrl // FIX: Added missing variable
        });
      }

      // Compare passwords using bcryptjs
      const match = await bcrypt.compare(password, admin.password_hash);
      if (!match) {
        req.log.warn({ event: 'admin.login.failed', email }, 'Invalid login attempt - wrong password');
        return res.render('admin/login', {
          title: 'Admin Login',
          csrfToken: csrfTokens.create(csrfTokens.secretSync()),
          error: 'Invalid email or password.',
          returnUrl: returnUrl // FIX: Added missing variable
        });
      }

      // Login successful!
      req.session.adminId = admin.id;
      req.session.adminName = admin.name;
      
      // Update last_login time
      await db('admins').where('id', admin.id).update({ last_login: new Date() });

      req.log.info({ event: 'admin.login.success', adminId: admin.id }, 'Admin logged in successfully');
      
      return res.redirect(returnUrl);

    } catch (err) {
      req.log.error({ err, event: 'admin.login.error' }, 'Database error during login');
      return res.render('admin/login', {
        title: 'Admin Login',
        csrfToken: csrfTokens.create(csrfTokens.secretSync()),
        error: 'Internal server error. Please try again.',
        returnUrl: returnUrl // FIX: Added missing variable
      });
    }
  },

  // GET /admin/dashboard - The admin home page
  getDashboard: async (req, res) => {
    try {
      const db = getDb();
      // Fetch some quick stats for the dashboard
      const stats = await db.transaction(async (trx) => {
        const projectsCount = await trx('projects').count('id as count').first();
        const unreadMessages = await trx('contact_submissions').where('is_read', false).count('id as count').first();
        const upcomingEvents = await trx('events').where('status', 'upcoming').count('id as count').first();
        return {
          projects: projectsCount.count,
          unreadMessages: unreadMessages.count,
          upcomingEvents: upcomingEvents.count
        };
      });

      res.render('admin/dashboard', {
        title: 'Dashboard | FK Systems Admin',
        adminName: req.session.adminName,
        stats
      });
    } catch (err) {
      req.log.error({ err }, 'Failed to load admin dashboard');
      res.status(500).send('Error loading dashboard');
    }
  },

  // GET /admin/logout - Logs out the admin
  logout: (req, res) => {
    req.log.info({ event: 'admin.logout', adminId: req.session.adminId }, 'Admin logged out');
    req.session.destroy((err) => {
      if (err) {
        req.log.error({ err }, 'Error destroying session on logout');
      }
      res.redirect('/admin');
    });
  }
};