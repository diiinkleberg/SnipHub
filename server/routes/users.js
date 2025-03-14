const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const Snippet = require('../models/Snippet');

// Get all favorites for current user
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get all snippet documents that match favorite IDs
    const favorites = await Snippet.find({
      _id: { $in: user.favorites },
    }).populate('user', 'username');

    res.json(favorites);
  } catch (error) {
    console.error('Error getting favorites:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a snippet to user's favorites
router.post('/favorites/:snippetId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const snippetId = req.params.snippetId;

    // Make sure snippet exists
    const snippet = await Snippet.findById(snippetId);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Check if already favorited
    if (user.favorites.includes(snippetId)) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    // Add to favorites list
    user.favorites.push(snippetId);
    await user.save();

    res.json(user.favorites);
  } catch (error) {
    console.error('Error adding favorite:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a snippet from user's favorites
router.delete('/favorites/:snippetId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const snippetId = req.params.snippetId;

    // Check if snippet is in favorites
    if (!user.favorites.includes(snippetId)) {
      return res.status(400).json({ message: 'Not in favorites' });
    }

    // Remove from favorites list
    user.favorites = user.favorites.filter((id) => id.toString() !== snippetId);
    await user.save();

    res.json(user.favorites);
  } catch (error) {
    console.error('Error removing favorite:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    // Find user by ID but don't return password or email
    const user = await User.findById(req.params.id).select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all snippets created by a user
router.get('/:id/snippets', async (req, res) => {
  try {
    const snippets = await Snippet.find({ user: req.params.id })
      .sort({ createdAt: -1 }) // Sort newest first
      .populate('user', 'username'); // Include username

    res.json(snippets);
  } catch (error) {
    console.error('Error getting snippets:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
