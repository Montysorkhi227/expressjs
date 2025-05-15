const jwt=require('jsonwebtoken')
const verifyToken =(req,res,next)=>{
    const token=req.headers['authorization']?.split('')[1];
    if(!token) return res.status(401).send({message:'Unauthorized'})
        try {
    const decoded=jwt.verify(token,process.env.SECRET_KEY)
    req.user=decoded
        }
        catch (error) {
            return res.status(400).send({message:'Invalid token'})
            }
    next()
}
module.exports=verifyToken;