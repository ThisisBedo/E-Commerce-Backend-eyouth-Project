const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const seedData = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing. Add it to the project .env file before running the seed script.');
        }

        await mongoose.connect(process.env.MONGO_URI);
        
        await Category.deleteMany();
        await Product.deleteMany();
        await Cart.deleteMany();
        await Order.deleteMany();

        const tech = await Category.create({ name: 'Electronics' });
        const books = await Category.create({ name: 'Books' });

        await Product.create([
            { name: 'Laptop', price: 999.99, description: 'High performance laptop', category: tech._id },
            { name: 'Smartphone', price: 499.99, description: 'Latest generic smartphone', category: tech._id },
            { name: 'Node.js Guide', price: 29.99, description: 'Master backend JavaScript', category: books._id },
            { name: 'Mechanical Keyboard', price: 120.00, description: 'RGB backlit mechanical keyboard', category: tech._id },
            { name: 'Wireless Mouse', price: 45.50, description: 'Ergonomic wireless mouse', category: tech._id },
            { name: 'Coffee Table Book', price: 55.00, description: 'Photography collection', category: books._id },
            { name: 'Noise Cancelling Headphones', price: 299.99, description: 'Over-ear wireless headphones', category: tech._id },
            { name: 'Fiction Novel', price: 15.99, description: 'Best-selling mystery thriller', category: books._id },
            { name: 'USB-C Hub', price: 35.00, description: '7-in-1 multi-port adapter', category: tech._id },
            { name: 'Cookbook', price: 25.00, description: 'Healthy recipes for busy people', category: books._id }
        ]);

        console.log('Database seeded perfectly!');
        process.exit();
    } catch (error) {
        console.error(`Seed failed: ${error}`);
        process.exit(1);
    }
};

seedData();
