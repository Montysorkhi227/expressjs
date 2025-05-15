const nodemailer=require("nodemailer")
require("dotenv").config()
const transporter=nodemailer.createTransport({service:"gmail",auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASSWORD
}})

// FUNCTION FOR SENDING MAIL
const sendMail= async(to,subject,text,html)=>{
    try{
await transporter.sendMail({
    from:process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
})
console.log(`Mail sent successfully to ${to}`);
    }
    catch(error){
        console.log(error)
        console.error("ERROR IN SENDING EMAIL")
    }
}
module.exports=sendMail;