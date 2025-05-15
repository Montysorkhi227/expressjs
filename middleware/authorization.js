const jwt= require("jsonwebtoken");
const User = require("../models/user");
 
const authmiddleware=async(req,res,next)=>{
    const token=req.headers['authorization']?.split(' ')[1];
    if(!token) return res.status(403).json({message:"Chala ja Dash Dash"});
    try{
        const decoded=jwt.verify(token,process.env.SECRET_KEY);
        const user=await User.findOne({email:decoded.email})
        console.log(user)
        if(!user) return res.status(404).json({message:"User not found"});
        req.user=user;
        next();
    }
    catch(e){
        console.log(e)
        res.status(500).json({message:"Kuch GADBAD H RE BABA!"});
        }  

}

const authorizeRole=(role)=>{
    return (req,res,next)=>{
        if(!req.user.role===role){
            return res.status(404).json({message:"Access Denied!!"});
        }
        next();
    }
}
module.exports={authmiddleware,authorizeRole};  