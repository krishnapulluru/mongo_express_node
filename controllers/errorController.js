const AppError = require("../utils/appError")

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`
  return new AppError(message, 400);
}

const handleJWTSignatureError = err => new AppError("Invalid token, please login again." , 401);

const handleJwtExpired = err => new AppError("Your token was expired please login again." , 401);

const sendProdError = (err, res) => {
  err.isOperational ? (res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })) : (
    console.error("Error : ", err),
    res.status(500).json({
      status: 'error',
      message: 'Somthing went very wrong!'
    })
  )
}

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  let error = err;
  process.env.NODE_ENV === 'production' ? (
    ( error.name === 'CastError' && (error = handleCastErrorDB(err)),
      error.name === 'JsonWebTokenError' && (error =handleJWTSignatureError(err)),
      error.name === 'TokenExpiredError' && (error = handleJwtExpired(err))
    ),sendProdError(error, res)) : process.env.NODE_ENV === 'development' && sendDevError(err, res)
}