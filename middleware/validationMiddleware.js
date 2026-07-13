const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

exports.validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMsg = errors.array().map(err => `${err.path}: ${err.msg}`).join(', ');
        return next(new AppError(`Validation failed: ${errorMsg}`, 400));
    }
    next();
};
