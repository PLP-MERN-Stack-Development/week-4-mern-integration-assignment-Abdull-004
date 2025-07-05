const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json(categories);
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public (for now)
const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Please add a category name');
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
});

module.exports = {
    getCategories,
    createCategory,
};