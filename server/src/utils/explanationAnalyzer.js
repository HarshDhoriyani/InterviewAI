const analyzeExplanation = (explanation, code, complexity) => {
    let score = 100;
    let feedback = [];

    // Length check
    if (explanation.length < 40) {
        score -= 20;
        feedback.push("Explanation is too brief");
    }

    // Structure Keywords
    const structureKeywords = [
        "approach",
        "iterate",
        "loop",
        "map",
        "hash",
        "time complexity",
        "space complexity",
    ];

    const found = structureKeywords.filter(k => 
        explanation.toLowerCase().includes(k)
    );

    if (found.length < 2) {
        score -= 20;
        feedback.push("Lacks clear algorithmic structure.")
    }

    // Complexity Awareness
    if (
        complexity && !explanation.toLowerCase().includes("complexity")
    ) {
        score -= 15;
        feedback.push("Time/space complexity not mentioned");
    }

    // Code-explanation alignment (basic)
    if (
        code.includes("for") && !explanation.toLowerCase().includes("loop")
    ) {
        score -= 10;
        feedback.push("Explanation does not describe looping logic.");
    }


    return {
        explanationScore: Math.max(score, 0),
        feedback,
    };
};


module.exports = { analyzeExplanation };