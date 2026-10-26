export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ message: "Validation failed.", details });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue ?? {})[0] ?? "value";
    return res.status(409).json({ message: `${field} already exists.` });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource ID." });
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body must contain valid JSON." });
  }

  console.error(error);
  return res.status(500).json({
    message: "An unexpected server error occurred.",
    ...(process.env.NODE_ENV === "development" ? { details: error.message } : {}),
  });
}
