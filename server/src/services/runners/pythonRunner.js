const { exec } = require("child_process");

const runPython = async (code) => {
    return new Promise((resolve) => {
        exec(
            `python3 -- << 'EOF'\n${code}\nEOF`,
            { timeout: 1000, maxBuffer: 1024 * 1024 },
            (error, stdout, stderr) => {
                if (error) {
                    return resolve({ error: stderr || error.message });
                }
                resolve({ output: stdout });
            }
        );
    });
};

module.exports = { runPython };