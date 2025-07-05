const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            maxlength: [100, 'Description cannot be more than 100 characters']
        }
    }, { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);