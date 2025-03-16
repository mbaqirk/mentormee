const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, addComment } = require('../controllers/postController');
const protect= require('../middleware/authMiddleware');

console.log({ createPost, getPosts, likePost, addComment });

// Define routes
router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);

module.exports = router;