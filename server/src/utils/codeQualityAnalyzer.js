const analyzeCodeQuality = (code) => {
  let score = 100;
  let feedback = [];

  // Check for comments
  if (!code.includes("//") && !code.includes("/*")) {
    score -= 10;
    feedback.push("No comments found.");
  }

  // Detect too many single-letter variables
  const singleLetterVars = code.match(/\b[a-zA-Z]\b/g);
  if (singleLetterVars && singleLetterVars.length > 5) {
    score -= 15;
    feedback.push("Too many single-letter variable names.");
  }

  // Check use of const
  if (!code.includes("const")) {
    score -= 5;
    feedback.push("Consider using const where possible.");
  }

  return {
    qualityScore: score < 0 ? 0 : score,
    feedback,
  };
};

module.exports = { analyzeCodeQuality };
