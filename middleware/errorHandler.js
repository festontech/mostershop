const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err.stack);
  
  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  
  // For API routes, return JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.status(statusCode).json({
      success: false,
      error: message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  }

  // For web routes, render error page
  res.status(statusCode).render('error', {
    title: 'Error',
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;