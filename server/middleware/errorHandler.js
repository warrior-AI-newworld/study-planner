export function notFoundHandler(request, response) {
  return response.status(404).json({
    success: false,
    error: { message: `Route not found: ${request.method} ${request.originalUrl}` },
  });
}

export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({
      success: false,
      error: { message: 'Request body must contain valid JSON.' },
    });
  }

  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((fieldError) => fieldError.message).join(' ');
    return response.status(400).json({ success: false, error: { message } });
  }

  console.error(error);
  return response.status(500).json({
    success: false,
    error: { message: 'An unexpected server error occurred.' },
  });
}
