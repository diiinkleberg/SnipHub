const mongoose = require('mongoose');

// Create the schema for snippets
const snippetSchema = new mongoose.Schema(
  {
    // Title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Code snippet
    code: {
      type: String,
      required: true,
    },

    // Programming language
    programmingLanguage: {
      type: String,
      required: true,
      default: 'javascript',
    },

    // Optional description
    description: {
      type: String,
      trim: true,
    },

    // The user who created this snippet
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the model
module.exports = mongoose.model('Snippet', snippetSchema);
