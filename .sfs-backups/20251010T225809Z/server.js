const express=require("express"); const app=express();
app.get("/health",(_,res)=>res.json({ok:true,service:"SocialScaleBoosterAIbot"}));
app.use(require("express").static("public",{extensions:["html"]}));
app.listen(process.env.PORT||5000,()=>console.log("Server up"));
