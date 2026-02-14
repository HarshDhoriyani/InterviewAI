const vm = require("vm");

const runJavaScript = async (userCode, functionName, testCases) => {
    let passed = 0;
    let results = [];

    try {
        const context = {};
        vm.createContext(context);

        const script = new vm.Script(userCode);

        // timeout protection
        script.runInContext(context, { timeout: 1000 });

        for (const testCase of testCases) {
            const args = eval(`[${testCase.input}]`);
            const expected = JSON.parse(testCase.expectedOutput);

            const output = context[functionName](...args);

            const isCorrect = JSON.stringify(output) === JSON.stringify(expected);

            if (isCorrect) passed++;

            results.push({
                input: testCase.input,
                expected,
                output,
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