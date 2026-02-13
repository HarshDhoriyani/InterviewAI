const vm = require("vm");

const runJavaScript = (userCode, functionName, testCases) => {
  let passed = 0;
  let results = [];

  try {
    const script = new vm.Script(userCode);

    const context = {};
    vm.createContext(context);

    script.runInContext(context);

    for (let testCase of testCases) {
      const args = eval(`[${testCase.input}]`);

      const result = context[functionName](...args);

      const expected = JSON.parse(testCase.expectedOutput);

      const isCorrect =
        JSON.stringify(result) === JSON.stringify(expected);

      if (isCorrect) passed++;

      results.push({
        input: testCase.input,
        expected,
        output: result,
        passed: isCorrect,
      });
    }

    return {
      passed,
      total: testCases.length,
      results,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

module.exports = { runJavaScript };
