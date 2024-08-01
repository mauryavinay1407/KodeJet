const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv=require("dotenv");
require('dotenv').config();

const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePython } = require("./executePython");
const Job = require("./models/job.model");

mongoose
  .connect(`${process.env.MONGO_URI}`)
  .then(() => console.log(`DB is connected`))
  .catch((err) => console.log(`DB connection is failed!!!`));

const app = express();   

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/status",async(req,res)=>{
  const jobId=req.query.id;
  if(!jobId)
    return res.status(400).json({success:false,error:"missing id query param"});
  try {
    const job=await Job.findById(jobId);
    if(!job){
      return res.stauts(404).json({success:false,error:"invalid job id"}); 
    }
    return res.status(200).json({success:true,job});
  } catch (error) {
    // console.log(error);
    return res.status(400).json({success:false,error:JSON.stringify(error)});
  }
});
app.get("/api",(req,res)=>{
  res.status(200).json({
    msg:"Hello from server"
  })
})
app.post("/api/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  if (!code)
  {
    return res
      .status(400)
      .json({ success: false, error: "Empty code body ain't allowed" });
  }

    let job;
  try {
    let output;
    //generate files for compilation and execute i.e xyz.cpp
    const filepath = await generateFile(language, code);

    job = await Job.create({ language, filepath });
    const jobId = job._id;
    // console.log(job);

    res.status(201).json({ success: true, jobId });

    job.startedAt = new Date();
    //to execute cpp file
    if (language === "cpp") {
      output = await executeCpp(filepath);
    }
    //to run python file
    else if (language === "py") {
      output = await executePython(filepath);
    }

    job.completedAt = new Date();
    job.status = "success";
    job.output = output;
    await job.save();
 
  
  } catch (error) {
    if (job) {
      job.completedAt = new Date();
      job.status = "error";
      job.output = JSON.stringify(error);
      await job.save();
    }
    console.log(error);
   
  }
});

app.listen(process.env.PORT||3000, () => {
  console.log("Server is running at http://localhost:3000");
});
