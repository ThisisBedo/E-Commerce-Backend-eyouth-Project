require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const seedData = async () => {
    try {
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
            { name: 'Node.js Guide', price: 29.99, description: 'Master backend JavaScript', category: books._id }
        ]);

        console.log('Database seeded perfectly!');
        process.exit();
    } catch (error) {
        console.error(`Seed failed: ${error}`);
        process.exit(1);
    }
};

seedData();
