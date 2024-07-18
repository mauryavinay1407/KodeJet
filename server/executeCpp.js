const fs=require('fs');
const {exec}=require('child_process');
const path = require('path');

const dirOutput=path.join(__dirname,'outputs');

if(!fs.existsSync(dirOutput))
    fs.mkdirSync(dirOutput,{recursive:true});

const executeCpp=(filepath)=>{
    const jobId=path.basename(filepath).split(".")[0];
    const outPath=path.join(dirOutput,`${jobId}.out`);
    return new Promise((resolve, reject) => {
        exec(
            // `g++ ${filepath} -o ${outPath} && cd ${dirOutput} && .\\${jobId}.exe`,
            `g++ "${filepath.replace(/\\/g, '\\\\')}" -o "${outPath.replace(/\\/g, '\\\\')}" && "${outPath.replace(/\\/g, '\\\\')}"`,
            (error, stdout, stderr) => {
                error && reject({ error, stderr });
                stderr && reject(stderr);
                resolve(stdout);
            }
          );
    })
}

module.exports={
    executeCpp
}
