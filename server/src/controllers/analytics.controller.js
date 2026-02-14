const Performance = require("../models/Performance");

exports.getAnalytics = async (req, res) => {
  try {
    const performance = await Performance.findOne({ user: req.user._id });

    if (!performance) {
      return res.status(404).json({ message: "No performance data yet." });
    }

    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
