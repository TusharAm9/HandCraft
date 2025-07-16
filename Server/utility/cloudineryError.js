function cloudinaryErrorHandler(err, req, res, next) {
  let error = err;

  if (typeof err === "string") {
    error = {
      message: err,
      statusCode: 500,
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}
