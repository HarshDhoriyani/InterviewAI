const Session = require("../models/Session");

const getSessions = async(req, res) => {
    try {
        const sessions = await Session.find({ user: req.user.id })
            .populate("question", "title topic difficulty")
            .sort({ startedAt: -1 })
            .limit(20);
        
        res.status(200).json({ sessions });
    }
    catch (err) {
        console.error("[Sessions] Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getSessions };