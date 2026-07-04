const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'CastError') {
        err.message = 'Invalid resource id';
        res.status(400);
    }

    if (err.name === 'ValidationError') {
        res.status(400);
    }

    if (err.code === 11000) {
        err.message = 'Duplicate field value entered';
        res.status(400);
    }
    
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error Error Intercepted',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
