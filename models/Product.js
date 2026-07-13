const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: [0, 'Price must be a positive number'] },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true, min: [0, 'Stock cannot be negative'], default: 0 },
    isActive: { type: Boolean, default: true, select: false }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ProductSchema.virtual('inStock').get(function() {
    return this.stock > 0;
});

// Query middleware to filter out inactive products (soft deletes)
ProductSchema.pre(/^find/, function() {
    this.find({ isActive: { $ne: false } });
});

module.exports = mongoose.model('Product', ProductSchema);