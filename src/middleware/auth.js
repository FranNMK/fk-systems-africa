/* 
 * src/middleware/auth.js - Admin authentication middleware.
 * Protects all routes under /admin, redirecting unauthenticated users to login.
 */

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.adminId) {
      return next();
    }
    // Redirect to the admin login page (with a return URL)
    res.redirect('/admin?returnUrl=' + encodeURIComponent(req.originalUrl));
  }
};