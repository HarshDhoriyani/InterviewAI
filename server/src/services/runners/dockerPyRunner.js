const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const runPythonDocker = async ({ code, functionName, testCases }) => {
    const jobId = uuidv4();
    const jobDir = path.join(__dirname, "../../../tmp", jobId);


    fs.mkdirSync(jobDir, { recursive: true });

    fs.writeFileSync(
        path.join(jobDir, "input.json"),
        JSON.stringify({ code, functionName, testCases })
    );

    let output;
    
    try {
        execSync(
            `docker run --rm \
            --network none \
            --cpus="0.5" \
            --memory="128m" \
            -v ${jobDir}:/app \
            py-sandbox`,
            {timeout: 2000}     
        );

        output = JSON.parse(
            fs.readFileSync(path.join(jobDir, "output.json"), "utf-8")
        );
    }
    catch (err) {
        output = { error: "Python execution failed or timed out"};
    }

    fs.rmSync(jobDir, { recursive: true, force: true });

    return output;
};

module.exports = { runPythonDocker };