const mongoose = require("mongoose");

require('dotenv').config();

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.Mongo_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
        })
        console.log("success");
    }

    catch(error){
        console.log(error);
        console.log("error occured");
        
        
    }
}

module.exports=connectDB;