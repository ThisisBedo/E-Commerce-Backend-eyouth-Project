const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ userId: 'guest_user' }).populate('items.productId');
        if (!cart) {
            cart = await Cart.create({ userId: 'guest_user', items: [] });
        }
        res.status(200).json(cart);
    } catch (err) { next(err); }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const qty = quantity === undefined ? 1 : Number(quantity);

        const product = await Product.findById(productId);
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        let cart = await Cart.findOne({ userId: 'guest_user' });
        if (!cart) cart = new Cart({ userId: 'guest_user', items: [] });

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += qty;
        } else {
            cart.items.push({ productId, quantity: qty });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) { next(err); }
};

exports.updateCartQuantity = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const qty = Number(quantity);

        const cart = await Cart.findOne({ userId: 'guest_user' });
        if (!cart) {
            return next(new AppError('Cart not found', 404));
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return next(new AppError('Item not in cart', 404));
        }

        cart.items[itemIndex].quantity = qty;
        await cart.save();
        res.status(200).json(cart);
    } catch (err) { next(err); }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId: 'guest_user' });
        if (!cart) {
            return next(new AppError('Cart not found', 404));
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) { next(err); }
};
