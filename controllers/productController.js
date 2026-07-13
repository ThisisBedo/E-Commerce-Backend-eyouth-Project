const Product = require('../models/Product');
const AppError = require('../utils/AppError');

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
        const product = await Product.findById(req.params.productId).populate('category', 'name');

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};
