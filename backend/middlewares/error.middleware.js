function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  if (status >= 500) {
    console.error("Unhandled error:", err);
  }

  const isProduction = process.env.NODE_ENV === "production";
  const message =
    status >= 500 && isProduction
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

res.status(status).json({
    success: false,
    message,
    ...(err.errors ? { errors: err.errors } : {}),
  });
}

module.exports = errorHandler;
