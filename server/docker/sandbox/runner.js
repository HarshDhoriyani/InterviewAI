const fs = require("fs");
const vm = require("vm");

const input = JSON.parse(fs.readFileSync("/app/input.json", "utf-8"));

const { code, functionName, testCases } = input;

let passed = 0;
let results = [];

try {
    const context = {};
    vm.createContext(context);

    const script = new vm.Script(code);
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

    fs.writeFileSync(
        "/app/output.json",
        JSON.stringify({ passed, total: testCases.length, results })
    );
    
}
catch (err) {
    fs.writeFileSync(
        "/app/output.json",
        JSON.stringify({ error: err.message })
    );
}