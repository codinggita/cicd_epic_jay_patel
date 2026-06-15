const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Analytics metric event type is required'],
      index: true, // Speed up metrics aggregations
    },
    count: {
      type: Number,
      default: 1,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Flexible schemas to record dynamic JSON details (e.g. queries, tools)
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// High-speed sorting query indexing
AnalyticsSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
