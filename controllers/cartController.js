const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const getRequestedQuantity = (quantity) => {
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
        return null;
    }

    return parsedQuantity;
};

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
        const qty = getRequestedQuantity(quantity === undefined ? 1 : quantity);

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400);
            throw new Error('A valid productId is required');
        }

        if (!qty) {
            res.status(400);
            throw new Error('Quantity must be a whole number of at least 1');
        }

        const product = await Product.findById(productId);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
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
        const qty = getRequestedQuantity(quantity);

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400);
            throw new Error('A valid productId is required');
        }

        if (!qty) {
            res.status(400);
            throw new Error('Quantity must be a whole number of at least 1');
        }

        const cart = await Cart.findOne({ userId: 'guest_user' });
        if (!cart) {
            res.status(404);
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            res.status(404);
            throw new Error('Item not in cart');
        }

        cart.items[itemIndex].quantity = qty;
        await cart.save();
        res.status(200).json(cart);
    } catch (err) { next(err); }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400);
            throw new Error('A valid productId is required');
        }

        const cart = await Cart.findOne({ userId: 'guest_user' });
        if (!cart) {
            res.status(404);
            throw new Error('Cart not found');
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) { next(err); }
};
