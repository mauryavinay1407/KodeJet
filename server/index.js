const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePython } = require("./executePython");
const Job = require("./models/job.model");

mongoose
  .connect("mongodb://localhost:27017/kodejet")
  .then(() => console.log(`DB is connected`))
  .catch((err) => console.log(`DB connection is failed!!!`));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json({
    hello: "World",
  });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  if (!code)
    return res
      .status(400)
      .json({ success: false, error: "Empty code body ain't allowed" });

    let job;
  try {
    let output;
    //generate files for compilation and execute i.e xyz.cpp
    const filepath = await generateFile(language, code);

    job = await Job.create({ language, filepath });
    const jobId = job._id;
    console.log(job);

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

    console.log(job);
  } catch (error) {
    job.completedAt = new Date();
    job.status = "error";
    job.output = JSON.stringify(error);
    await job.save();
    console.log(error);
    //  return res.status(500).json({error})
  }
});

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
