const Transcript = require("../models/Transcript");
const Session = require("../models/Session");
const Evaluation = require("../models/Evaluation");
const { analyzeExplanation } = require("../utils/explanationAnalyzer");


exports.submitExplanation = async (req, res) => {
    const { sessionId, explanation } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
        return res.status(404).json({ message: "Session not found" });
    }

    const evaluation = await Evaluation.findOne({ session: sessionId });
    if (!evaluation) {
        return res.status(400).json({ message: "Submit code first" });
    }

    const analysis = analyzeExplanation(
        explanation,
        evaluation.code,
        evaluation.estimatedComplexity
    );

    const transcript = await Transcript.create({
        session: sessionId,
        explanation,
        explanationScore: analysis.explanationScore,
        feedback: analysis.feedback.join(" "),
    });


    // update final score
    evaluation.totalScore = evaluation.totalScore * 0.85 + analysis.explanationScore * 0.15 ;

    await evaluation.save();

    res.json({
        explanationScore: analysis.explanationScore,
        feedback: analysis.feedback,
        updatedTotalScore: evaluation.totalScore,
    });
};