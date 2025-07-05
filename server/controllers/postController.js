const Post = require('../models/Post');
const asyncHandler = require('express-async-handler'); // To avoid writing try-catch repeatedly

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().populate('category'); // Populate category details
    res.status(200).json(posts);
});

// @desc    Get a specific blog post
// @route   GET /api/posts/:id
// @access  Public
const getPost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('category');
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }
    res.status(200).json(post);
});

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Public (for now, will be Private with auth)
const createPost = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;

    // Basic validation (more robust with Joi/express-validator)
    if (!title || !content) {
        res.status(400);
        throw new Error('Please add a title and content');
    }

    const post = await Post.create({
        title,
        content,
        category,
        // author: req.user.id // For future authentication
    });

    res.status(201).json(post);
});

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Public
const updatePost = asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
});

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Public
const deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    await post.deleteOne(); // Mongoose 6+ uses deleteOne() or deleteMany()

    res.status(200).json({ id: req.params.id, message: 'Post removed' });
});

module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
};