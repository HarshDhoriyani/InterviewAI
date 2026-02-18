const mongoose = require("mongoose");

const codeSnapshotSchema = new mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true, 
        },
        code: String,
        timestamp: Date,
    },
    { timestamps: true }
);


module.exports = mongoose.model("CodeSnapshot", codeSnapshotSchema);