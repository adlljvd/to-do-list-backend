const errorHandler = (error, req, res, next) => {
  let status = 500;
  let message = "Internal server error";

  // Mongoose Validation Error
  if (error.name === "ValidationError") {
    status = 400;
    message = Object.values(error.errors)
      .map((err) => err.message)
      .join(", ");
  }

  // Mongoose Duplicate Key Error
  if (error.code === 11000) {
    status = 400;
    message = `${Object.keys(error.keyValue)[0]} already exists`;
  }

  // Bad Request Error
  if (error.name === "BadRequest") {
    status = 400;
    message = "Please input email and password";
  }

  // Cast Error (Invalid ObjectId)
  if (error.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
  }

  // Login Error
  if (error.name === "LoginError") {
    status = 401;
    message = "Invalid email or password";
  }

  // JWT Error
  if (error.name === "JsonWebTokenError") {
    status = 401;
    message = "Please login first!";
  }

  // Unauthorized Error
  if (error.name === "Unauthorized") {
    status = 401;
    message = "Invalid credentials";
  }

  // Forbidden Error
  if (error.name === "Forbidden") {
    status = 403;
    message = "You are not authorized";
  }

  // Not Found Error
  if (error.name === "NotFound") {
    status = 404;
    message = "Data not found";
  }

  console.log(error); // For debugging

  res.status(status).json({
    message,
    // Add stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = errorHandler;
