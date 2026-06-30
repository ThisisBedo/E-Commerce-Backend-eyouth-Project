const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartQuantity, removeFromCart } = require('../controllers/cartController');

router.route('/').get(getCart).post(addToCart).put(updateCartQuantity);
router.route('/:productId').delete(removeFromCart);

module.exports = router;