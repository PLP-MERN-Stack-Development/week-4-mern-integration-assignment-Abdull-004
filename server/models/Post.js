const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
            unique: true, // Titles should be unique
        },
        content: {
            type: String,
            required: [true, 'Please add content'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category', // Reference to the Category model
            required: false, // Can be optional initially
        },
        author: { // Placeholder for future user integration
            type: String,
            default: 'Anonymous',
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

module.exports = mongoose.model('Post', postSchema);