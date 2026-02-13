const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const analyzeComplexity = (code) => {
  try {
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx"],
    });

    let loopDepth = 0;
    let maxDepth = 0;
    let recursionDetected = false;

    traverse(ast, {
      enter(path) {
        if (
          path.isForStatement() ||
          path.isWhileStatement() ||
          path.isForInStatement() ||
          path.isForOfStatement()
        ) {
          loopDepth++;
          if (loopDepth > maxDepth) maxDepth = loopDepth;
        }

        if (path.isCallExpression()) {
          const callee = path.node.callee.name;
          if (callee && code.includes(`function ${callee}`)) {
            recursionDetected = true;
          }
        }
      },
      exit(path) {
        if (
          path.isForStatement() ||
          path.isWhileStatement() ||
          path.isForInStatement() ||
          path.isForOfStatement()
        ) {
          loopDepth--;
        }
      },
    });

    if (recursionDetected) return "O(2^n)";
    if (maxDepth === 0) return "O(1)";
    if (maxDepth === 1) return "O(n)";
    if (maxDepth === 2) return "O(n^2)";
    if (maxDepth >= 3) return "O(n^3)";

    return "Unknown";

  } catch (error) {
    return "Unknown";
  }
};

module.exports = { analyzeComplexity };
