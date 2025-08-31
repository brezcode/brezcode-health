function globalErrorHandler(err, req, res, next) {
  console.error('❌ Server error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    ok: false,
    error: message
  });
}

export { globalErrorHandler };