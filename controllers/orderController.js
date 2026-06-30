const Cart = require('../models/Cart');
const Order = require('../models/Order');

exports.createOrder = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: 'guest_user' }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is completely empty' });
        }

        let totalPrice = 0;
        const orderItems = cart.items.map(item => {
            const itemTotal = item.productId.price * item.quantity;
            totalPrice += itemTotal;
            return {
                productId: item.productId._id,
                name: item.productId.name,
                price: item.productId.price,
                quantity: item.quantity
            };
        });

        const order = await Order.create({
            userId: 'guest_user',
            items: orderItems,
            totalPrice: parseFloat(totalPrice.toFixed(2))
        });

        // Clear cart items upon checkout integration completion
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (err) { next(err); }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: 'guest_user' }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) { next(err); }
};