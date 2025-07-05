class ExpressError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode; 
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ExpressError;
