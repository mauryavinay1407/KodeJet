const { exec } = require("child_process");
const path = require("path");

const executeC = (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outputFilePath = path.join(__dirname, `${jobId}.out`);

  return new Promise((resolve, reject) => {
    exec(`gcc ${filepath} -o ${outputFilePath} && ${outputFilePath}`, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      }
      if (stderr) {
        reject(stderr);
      }
      resolve(stdout);
    });
  });
};

module.exports = { executeC };
