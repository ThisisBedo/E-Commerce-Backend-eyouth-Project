const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode;
    error.status = err.status;

    if (err.name === 'CastError') {
        error = new AppError('Invalid resource id', 400);
    }

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(el => el.message);
        error = new AppError(`Invalid input data: ${messages.join('. ')}`, 400);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        error = new AppError(`Duplicate value for field: ${field}. Please use another value!`, 400);
    }
    
    const statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    const status = error.status || 'error';

    res.status(statusCode).json({
        status,
        message: error.message || 'Internal Server Error Error Intercepted',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
