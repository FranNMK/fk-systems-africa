/* 
 * src/middleware/auth.js - Admin authentication middleware.
 * Protects all routes under /admin, redirecting unauthenticated users to login.
 */

module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.adminId) {
      return next();
    }
    // CRITICAL: Added 'return' to stop the function from continuing execution!
    return res.redirect('/admin?returnUrl=' + encodeURIComponent(req.originalUrl));
  }
};