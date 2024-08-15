const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const dirOutput = path.join(__dirname, 'outputs');

if (!fs.existsSync(dirOutput)) {
    fs.mkdirSync(dirOutput, { recursive: true });
}

const executeJava = (filepath) => {
    const fileDir = path.dirname(filepath);
    const newFilePath = path.join(fileDir, 'Main.java');

    return new Promise((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) return reject(err);
            const updatedCode = data.replace(/public\s+class\s+\w+/, `public class Main`);

            fs.writeFile(newFilePath, updatedCode, 'utf8', (err) => {
                if (err) return reject(err);
                exec(
                    `cd "${fileDir}" && javac Main.java && java Main`,
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
        });
    });
}

module.exports = {
    executeJava
};
