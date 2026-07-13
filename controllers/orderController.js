const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

exports.createOrder = async (req, res, next) => {
    const decrementedProducts = [];
    try {
        const cart = await Cart.findOne({ userId: 'guest_user' }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return next(new AppError('Your cart is completely empty', 400));
        }

        let totalPrice = 0;
        const orderItems = [];

        for (const item of cart.items) {
            if (!item.productId) {
                throw new AppError('Cart contains a product that no longer exists', 400);
            }

            const product = item.productId;

            // Atomically check stock and decrement quantity
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: product._id, stock: { $gte: item.quantity }, isActive: { $ne: false } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new AppError(`Insufficient stock or product unavailable for: ${product.name}`, 400);
            }

            // Track decremented products to rollback in case of subsequent failures
            decrementedProducts.push({ productId: product._id, quantity: item.quantity });

            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        const order = await Order.create({
            userId: 'guest_user',
            items: orderItems,
            totalPrice: parseFloat(totalPrice.toFixed(2))
        });

        // Clear cart items upon checkout completion
        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (err) {
        // Rollback all successfully decremented stocks if any operation failed
        for (const rolledBack of decrementedProducts) {
            await Product.findByIdAndUpdate(rolledBack.productId, {
                $inc: { stock: rolledBack.quantity }
            });
        }
        next(err);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: 'guest_user' }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) { next(err); }
};
