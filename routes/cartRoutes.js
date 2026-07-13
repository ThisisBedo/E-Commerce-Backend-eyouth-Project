const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { getCart, addToCart, updateCartQuantity, removeFromCart } = require('../controllers/cartController');
const { validateRequest } = require('../middleware/validationMiddleware');

router.route('/')
    .get(getCart)
    .post(
        [
            body('productId').isMongoId().withMessage('Invalid product ID format'),
            body('quantity')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Quantity must be an integer of at least 1')
        ],
        validateRequest,
        addToCart
    )
    .put(
        [
            body('productId').isMongoId().withMessage('Invalid product ID format'),
            body('quantity')
                .isInt({ min: 1 })
                .withMessage('Quantity must be an integer of at least 1')
        ],
        validateRequest,
        updateCartQuantity
    );

router.route('/:productId').delete(
    [
        param('productId').isMongoId().withMessage('Invalid product ID format')
    ],
    validateRequest,
    removeFromCart
);

module.exports = router;