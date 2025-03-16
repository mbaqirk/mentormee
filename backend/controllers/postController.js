const Post = require('../models/Post');
const User = require('../models/User');

// Define all functions first
const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    // Check if the user is authenticated
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Create a new post
    const newPost = new Post({
      user: req.user.id, // Attach the user ID to the post
      content,
      imageUrl,
    });

    // Save the post to the database
    await newPost.save();

    // Populate the user details in the response
    const populatedPost = await Post.findById(newPost._id).populate(
      'user',
      'name email'
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getPosts = async (req, res) => {
  try {
    // Fetch all posts from the database and populate the user details
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by most recent first
      .populate('user', 'name email'); // Populate user details

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this post.' });
    }

    // Add the user's ID to the likes array
    post.likes.push(userId);
    await post.save();

    res.status(200).json({ message: 'Post liked successfully.', post });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user.id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Create a new comment
    const newComment = {
      user: userId,
      text,
    };

    // Add the comment to the post
    post.comments.push(newComment);
    await post.save();

    // Populate the user details in the response
    const populatedPost = await Post.findById(postId).populate({
      path: 'comments.user',
      select: 'name email',
    });

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Export all functions at the end
module.exports = {
  createPost,
  getPosts,
  likePost,
  addComment,
};