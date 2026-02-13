const analyzeEdgeCases = (code) => {
  let score = 100;
  let feedback = [];

  const edgePatterns = [
    "if (!",
    "if (",
    ".length === 0",
    "=== null",
    "=== undefined",
  ];

  const found = edgePatterns.some(pattern => code.includes(pattern));

  if (!found) {
    score -= 20;
    feedback.push("No explicit edge case handling detected.");
  }

  return {
    edgeCaseScore: score < 0 ? 0 : score,
    feedback,
  };
};

module.exports = { analyzeEdgeCases };
