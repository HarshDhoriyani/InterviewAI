const Question = require("../models/Question");
const Session = require("../models/Session");


// Start Interview
exports.startInterview = async (req, res) => {
  try {

    console.log("REQ USER:", req.user);
    
    const userId = req.user._id;

    const { difficulty } = req.body;

    const question = await Question.findOne({ difficulty });

    if (!question) {
      return res.status(404).json({ message: "No question found" });
    }

    const session = await Session.create({
      user: userId,
      question: question._id,
      difficulty: question.difficulty,
      topic: question.topic,
    });

    res.status(200).json({
      sessionId: session._id,
      question,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
