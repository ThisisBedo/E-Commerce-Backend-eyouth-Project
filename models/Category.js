const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true }
}, { timestamps: true });

// Pre-save hook to automatically generate category slug from its name
CategorySchema.pre('save', function() {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')      // Replace non-alphanumeric chars with hyphens
            .replace(/(^-|-$)+/g, '');        // Strip leading/trailing hyphens
    }
});

module.exports = mongoose.model('Category', CategorySchema);