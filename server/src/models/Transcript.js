const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true,
        },
        explanation: {
            type: String,
            required: true,
        },
        explanationScore: {
            type: Number,
            default: 0,
        },
        feedback: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);


module.exports = mongoose.model("Transcript", transcriptSchema);