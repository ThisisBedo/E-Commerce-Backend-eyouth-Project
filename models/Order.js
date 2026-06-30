const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true, default: "guest_user" },
    items: [OrderItemSchema],
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);