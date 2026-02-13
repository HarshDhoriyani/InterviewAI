const Question = require("../models/Question");
const Session = require("../models/Session");


// Start Interview
exports.startInterview = async (req, res) => {
  try {
    const { difficulty } = req.body;

    const question = await Question.findOne({ difficulty });

    if (!question) {
      return res.status(404).json({ message: "No question found" });
    }

    const session = await Session.create({
      user: req.user._id,
      question: question._id,
    });

    res.status(200).json({
      sessionId: session._id,
      question,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
