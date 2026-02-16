const { runJavaScriptDocker } = require("./runners/dockerJsRunner");
const { runPythonDocker } = require("./runners/dockerPyRunner");


const executeCode = async ({ code, language, functionName, testCases }) => {
    switch (language) {
        case "javascript":
            return await runJavaScriptDocker(code, functionName, testCases);

        case "python":
            return await runPythonDocker(code, functionName, testCases);

        default:
            return {
                error: "Language not supported yet",
            };
    }
};

module.exports = { executeCode };