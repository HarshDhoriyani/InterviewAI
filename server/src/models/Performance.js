const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalInterviews: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    topicStats: [
      {
        topic: String,
        averageScore: Number,
        attempts: Number,
      },
    ],
    difficultyStats: [
      {
        difficulty: String,
        averageScore: Number,
        attempts: Number,
      },
    ],
    confidenceScore: {
      type: Number,
      default: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Performance", performanceSchema);
