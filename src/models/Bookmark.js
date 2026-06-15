const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    knowledge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Knowledge',
      required: [true, 'Knowledge guide reference is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create compound unique index to prevent duplicate bookmarks on MongoDB level
BookmarkSchema.index({ user: 1, knowledge: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
