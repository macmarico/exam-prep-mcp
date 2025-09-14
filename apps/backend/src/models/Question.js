const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, trim: true, index: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
      index: true,
    },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

QuestionSchema.index({ topic: 1, difficulty: 1 });

module.exports = mongoose.model('Question', QuestionSchema);

