const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
            res.status(400);
            throw new Error('A valid productId is required');
        }

        const product = await Product.findById(req.params.productId).populate('category', 'name');

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};
