/*require("dotenv").config({path:"./config/config.env"});

const express=require('express')
const morgan=require("morgan");
const mongoose=require('mongoose');
const connectDB = require('./config/db');
const app=express()
const auth=require("./middlewares/auth");

app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());
app.use("/api",require("./routes/auth"));
app.use("/api",require("./routes/contact"));
app.get("/protected",auth,(req,res)=>{
    return res.status(200).json({...req.user._doc});
});

const PORT=process.env.PORT||8000;
app.listen(PORT,async()=>{
    try{
        await connectDB();
        console.log(`server listening on port:${PORT}`)
        
    }catch(err){
        console.log(err);

    }

});
*/
require("dotenv").config({ path: "./config/config.env" });

const express = require('express');
const morgan = require("morgan");
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Middleware and Routes as before
app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/contact"));

// Serve the static build files from the React application
app.use(express.static(path.join(__dirname, 'client/build')));

// Add a wildcard route to serve the React application's index.html for all other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`server listening on port:${PORT}`);
  } catch (err) {
    console.log(err);
  }
});

