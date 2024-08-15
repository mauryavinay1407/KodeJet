const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');


const executeJava = (filepath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outputDir = path.dirname(filepath);

    return new Promise((resolve, reject) => {
        exec(
            `javac "${filepath.replace(/\\/g, '\\\\')}" -d "${outputDir.replace(/\\/g, '\\\\')}" && java -cp "${outputDir.replace(/\\/g, '\\\\')}" ${jobId}`,
            (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr });
                } else if (stderr) {
                    reject(stderr);
                } else {
                    resolve(stdout);
                }
            }
        );
    });
}

module.exports = {
    executeJava
}
