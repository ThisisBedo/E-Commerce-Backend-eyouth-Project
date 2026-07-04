const Category = require('../models/Category');

exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
};
