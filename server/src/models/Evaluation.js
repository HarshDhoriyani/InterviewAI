const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "javascript",
    },
    correctnessScore: {
      type: Number,
      default: 0,
    },
    efficiencyScore: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
    estimatedComplexity: {
      type: String,
      default: "Unknown",
    },
    qualityScore: {
      type: Number,
      default: 0,
    },
    edgeCaseScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);
