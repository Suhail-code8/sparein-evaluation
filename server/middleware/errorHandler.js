// error handling middleware
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let details = null;

  // handle invalid object id
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid resource identifier: ${err.value}`;
  }

  // handle mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error occurred';
    details = Object.values(err.errors).map((e) => e.message);
  }

  res.status(statusCode).json({
    success: false,
    error: statusCode === 400 ? 'Bad Request' : statusCode === 404 ? 'Not Found' : 'Internal Server Error',
    message,
    details,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFoundHandler, errorHandler };
