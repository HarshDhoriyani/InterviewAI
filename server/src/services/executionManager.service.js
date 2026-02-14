const { runJavaScript } = require("./runners/jsRunner");
const { runPython } = require("./runners/pythonRunner");


const executeCode = async ({ code, language, functionName, testCases }) => {
    switch (language) {
        case "javascript":
            return await runJavaScript(code, functionName, testCases);

        case "python":
            return await runPython(code, functionName, testCases);

        default:
            return {
                error: "Language not supported yet",
            };
    }
};

module.exports = { executeCode };