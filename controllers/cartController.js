const Cart = require('../models/Cart');
const Product = require('../models/Product');

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
        const qty = parseInt(quantity) || 1;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

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
        if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

        const cart = await Cart.findOne({ userId: 'guest_user' });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not in cart' });

        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
    } catch (err) { next(err); }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ userId: 'guest_user' });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (err) { next(err); }
};