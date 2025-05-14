const isAuth = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  
  // Store the requested URL to redirect after login
  req.session.returnTo = req.originalUrl;
  req.session.error_msg = 'Please log in to access this page';
  res.redirect('/auth/login');
};

// Admin check middleware (must be used after isAuth)
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  
  req.session.error_msg = 'You do not have permission to access this page';
  res.status(403).render('error', {
    title: 'Access Denied',
    status: 403,
    message: 'You do not have permission to access this page'
  });
};

module.exports = { isAuth, isAdmin };