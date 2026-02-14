const Evaluation = require("../models/Evaluation");
const Session = require("../models/Session");
const Question = require("../models/Question");
const { runJavaScript } = require("../services/codeExecution.service");
const { analyzeComplexity } = require("../utils/complexityAnalyzer");
const { analyzeCodeQuality } = require("../utils/codeQualityAnalyzer");
const { analyzeEdgeCases } = require("../utils/edgeCaseAnalyzer");
const { updatePerformance } = require("../services/analytics.service");
const { executeCode } = require("../services/executionManager.service");



exports.submitCode = async (req, res) => {
  try {
    const { sessionId, code, language } = req.body;

    if (code.length > 10000) {
      return res.status(400).json({ message: "Code too long" });
    }

    const allowedLanguages = ["javascript", "python"];
    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({ message: "Unsupported language" });
    }

    const session = await Session.findById(sessionId).populate("question");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const question = session.question;

    const functionName = question.starterCode
      .match(/function\s+([a-zA-Z0-9_]+)/)[1];

    const executionResult = await executeCode({
      code,
      language,
      functionName,
      testCases: question.testCases,
    });

    if (executionResult.error) {
      return res.status(400).json({
        message: "Execution Error",
        error: executionResult.error,
      });
    }

    const estimatedComplexity = analyzeComplexity(code);

    let efficiencyScore = 0;

    if (estimatedComplexity === "O(n)") efficiencyScore = 100;
    else if (estimatedComplexity === "O(n^2)") efficiencyScore = 70;
    else if (estimatedComplexity === "O(n^3)") efficiencyScore = 40;
    else if (estimatedComplexity === "O(2^n)") efficiencyScore = 20;
    else efficiencyScore = 80;

    const qualityResult = analyzeCodeQuality(code);
    const edgeResult = analyzeEdgeCases(code);

    const qualityScore = qualityResult.qualityScore;
    const edgeCaseScore = edgeResult.edgeCaseScore;

    const correctnessScore =
      (executionResult.passed / executionResult.total) * 100;

    const totalScore = (correctnessScore * 0.5) + (efficiencyScore * 0.2) + (qualityScore * 0.15) + (edgeCaseScore * 0.15);



    const evaluation = await Evaluation.create({
      session: sessionId,
      code,
      language,
      correctnessScore,
      efficiencyScore,
      totalScore,
      edgeCaseScore,
      qualityScore,
      estimatedComplexity,
      feedback: `
        ${executionResult.passed}/${executionResult.total} test cases passed.
        Complexity: ${estimatedComplexity}.
        Quality: ${qualityResult.feedback.join(" ")}
        Edge Cases: ${edgeResult.feedback.join(" ")}
      `
    });

    session.status = "completed";
    session.score = totalScore;
    session.completedAt = new Date();
    await session.save();

    await updatePerformance(
      req.user._id,
      question,
      totalScore
    );


    res.status(200).json({
      evaluation,
      executionDetails: executionResult.results,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

