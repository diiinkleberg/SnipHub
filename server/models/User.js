const mongoose = require('mongoose');

// Create the schema for users
const userSchema = new mongoose.Schema(
  {
    // Username must be unique
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },

    // Email must be unique
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Password (will be hashed)
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Array of snippet IDs for favorites
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Snippet',
      },
    ],
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the model
module.exports = mongoose.model('User', userSchema);
