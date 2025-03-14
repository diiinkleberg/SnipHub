// This file handles snippet-related routes
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Snippet = require('../models/Snippet');

// GET /api/snippets
router.get('/', async (req, res) => {
  try {
    // Get filter parameters
    const { language, search } = req.query;

    // Initialize empty filter object
    const filter = {};

    // Add language filter if provided
    if (language) {
      filter.programmingLanguage = language;
    }

    // Add search filter if provided
    if (search) {
      // Look for search term in title, description and code
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    // Get filtered snippets
    const snippets = await Snippet.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('user', 'username'); // Include username

    res.json(snippets);
  } catch (error) {
    console.error('Error fetching snippets:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific snippet by ID
router.get('/:id', async (req, res) => {
  try {
    // Find snippet and include username
    const snippet = await Snippet.findById(req.params.id).populate(
      'user',
      'username'
    );

    // If snippet not found, return 404
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    res.json(snippet);
  } catch (error) {
    console.error('Error fetching snippet:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new snippet
router.post('/', auth, async (req, res) => {
  try {
    // Get snippet data from request body
    const { title, code, description, programmingLanguage, language } =
      req.body;

    // Handle both field names because of reserved word in MongoDB
    const langToUse = programmingLanguage || language || 'javascript';

    // Create new snippet object
    const newSnippet = new Snippet({
      title,
      code,
      programmingLanguage: langToUse,
      description,
      user: req.user.id,
    });

    // Save the snippet to database
    const snippet = await newSnippet.save();
    res.status(201).json(snippet);
  } catch (error) {
    console.error('Error creating snippet:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a snippet
router.put('/:id', auth, async (req, res) => {
  try {
    // Get updated snippet data from request body
    const { title, code, description, programmingLanguage, language } =
      req.body;

    // Find the snippet by ID
    let snippet = await Snippet.findById(req.params.id);

    // If snippet not found, return 404
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Check if the user owns the snippet
    if (snippet.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Handle both field names
    const langToUse = programmingLanguage || language;

    // Update snippet fields
    if (title) snippet.title = title;
    if (code) snippet.code = code;
    if (langToUse) snippet.programmingLanguage = langToUse;
    if (description !== undefined) snippet.description = description;

    // Save changes
    await snippet.save();

    // Refresh with populated user field
    snippet = await Snippet.findById(snippet._id).populate('user', 'username');

    res.json(snippet);
  } catch (error) {
    console.error('Error updating snippet:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a snippet
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find the snippet by ID
    const snippet = await Snippet.findById(req.params.id);

    // If snippet not found, return 404
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Check if the user owns the snippet
    if (snippet.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the snippet
    await snippet.deleteOne();
    res.json({ message: 'Snippet deleted' });
  } catch (error) {
    console.error('Error deleting snippet:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get list of all used programming languages
router.get('/languages/list', async (req, res) => {
  try {
    // Get distinct programming languages from snippets
    const languages = await Snippet.distinct('programmingLanguage');
    res.json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
