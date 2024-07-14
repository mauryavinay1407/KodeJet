const express=require("express");
const app=express();
const {generateFile}=require('./generateFile');
const { executeCpp } = require("./executeCpp");


app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
   return res.json({
    hello:"World"
   });
})
app.post('/run',async(req,res)=>{
    const {language="cpp",code}=req.body;
    if(!code)
        return res.status(400).json({success:false,error:"Empty code body ain't allowed"});
    
    try {
    const filepath=await generateFile(language,code);
    const output=await executeCpp(filepath);
    console.log(output);
    return res.json({output});
    } catch (error) {
     return res.status(400).json({error})    
    }
});

app.listen(3000,()=>{
    console.log("Server is running at http://localhost:3000");
})