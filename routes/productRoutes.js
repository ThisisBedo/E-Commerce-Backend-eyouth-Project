const express = require('express');
const { param } = require('express-validator');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');
const { validateRequest } = require('../middleware/validationMiddleware');

router.route('/').get(getProducts);

router.route('/:productId').get(
    [
        param('productId').isMongoId().withMessage('Invalid product ID format')
    ],
    validateRequest,
    getProductById
);

module.exports = router;
