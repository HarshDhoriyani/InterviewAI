const Session = require("../models/Session");



const getSessions = async(req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id })
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

const getUserProfile = async(req, res) => {
    try {
        const userId = req.user._id;

        const sessions = await Session.find({ user: userId }).sort({ startedAt: -1 });

        const scores = sessions.map(s => s.score || 0);

        const total = scores.length;

        const avg = total ? scores.reduce((a, b) => a + b, 0) / total : 0;

        const best = total ? Math.max(...scores) : 0;

        res.json({
            totalInterviews: total,
            avgScore: Math.round(avg),
            bestScore: best,
            history: sessions,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load profile "});
    }
};

module.exports = { getSessions, getUserProfile };