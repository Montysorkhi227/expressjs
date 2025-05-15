const express = require("express");
const connectDB = require("./database");
const User2 = require("./models/Course");
const User = require("./models/user");
const upload =require("./config/multer")
const sendMail = require("./config/nodemailerconfig");
const bcrypt = require("bcrypt");
require("dotenv").config();
const errorHandler=require("./middleware/errorHandler");
const logger = require("./middleware/logger")
const jwt=require('jsonwebtoken')
const {authmiddleware,authorizeRole}=require("./middleware/authorization")
const authToken=require("./middleware/authToken")
const app = express();
connectDB();
app.use(express.json());
const next=app.use(errorHandler)
app.post("/addCourse",authmiddleware,authorizeRole('Counsellor'),upload.single('Banner'), async (req, res) => {
    try {
        const { Title, TrainerName, CourseDuretion,Category,DiscountPercentage,OfferTillDate,StartDate,EndDate, CourseDiscription} = req.body;
        const Banner=req.file.path;
        const newCourse = new User2({
            CourseName,
            TrainerName,
            CourseDuretion,
            CourseDiscription,
            Category,
            DiscountPercentage,
            OfferTillDate,
            StartDate,
            EndDate,
            Banner
            });
            await newCourse.save();
            res.status(201).json({ message: "Course Added Successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

app.get("/allCourse", async (req, res) => {
    try {
        const {search,CourseDuretion,Category}=req.query
        let filter={}
        if(search){
            filter.Title={$regex:search,$options:'i'}}
            if(CourseDuretion)
            {
                filter.CourseDuretion={$regex:CourseDuretion,$options:'i'}
            }
            if(Category)
            {
                filter.Category={$regex:Category,$options:'i'}
            }
        const users2 = await User2.find();
        return res.json(users2);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
app.post("/api/users", async (req, res) => {
    try {
        const { name, email, password, contact,role } = req.body;

        // Hash the password
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate a OTP
        const otp = Math.floor(10000 + Math.random() * 90000).toString();

        // Create a  new user
        const newUser  = new User({ name, email, password: hashedPassword, contact, otp,role });
        await newUser.save();

       //`Send a OTP to user's email`
        const subject = "Welcome to our Platform 🔥 Your OTP For Verification";
        const text = `Hi ${name}, Thank You For Registering At our Platform. Your OTP Is ${otp}, please Don't share it with anyone.`;
        const html = `<h2>Thank You For Registering At our Platform🔥.</h2><p>Your OTP Is ${otp}, please Don't share it with anyone.</p>`;
        
        sendMail(email, otp, subject, text, html);
        console.log("Data inserted Successfully");
        return res.status(200).json({ message: "Successfully Inserted" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/allusers",authmiddleware,authorizeRole('Student'), async (req, res) => {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.put("/update/:id",logger, async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, password, contact } = req.body;

        // Hash the password if it is being updated
        let updateData = { name, email, contact };
        if (password) {
            const saltRounds = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, saltRounds);

        }

        const updatedUser  = await User.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedUser ) {
            return res.status(404).json({ message: "User  not Found" });
        }
        return res.status(200).json(updatedUser );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

app.patch("/updateSomefields/:id",logger, async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, password, contact } = req.body;
        // Hash the password if it is being updated
        let updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (contact) updateData.contact = contact;
        if (password) {
            const saltRounds = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser  = await User.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedUser){
            return res.status(404).json({ message: "User  not Found" });
        }
        return res.status(200).json(updatedUser );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

app.delete("/users/:id", logger , async (req, res) => {
    try {
        const deletedUser  = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser ) {
            return res.status(404).json({ message: "User  not Found" });
        }
        return res.status(200).json(deletedUser );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

app.post("/login", logger ,async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
            }
            const result=await bcrypt.compare(password,user.password);
            if(!result){
                return res.status(400).json({message:"Invalid password"});
            }
            const token= jwt.sign({email},process.env.SECRET_KEY,{
                expiresIn:"1h"
                });
            return res.status(200).json({message:"Login Succesfull",token})

    }catch(error){
        next(error);
    }
})


app.post("/verifyotp",logger ,async(req,res)=>{
    try {
        const {otp,email}=req.body;
        const findemail=await User.findOne({email});
        console.log(findemail)
        if(!findemail){
            return res.status(400).json({message:"User not found"});
            }
            if(!findemail.otp){
                return res.status(400).json({message:"Invalid otp"});
                }
                findemail.otp = null; 
                await findemail.save();
                return res.status(200).json({message:"Otp verified"});
    }catch(error){
        console.log(error)
        return res.status(500).json({ message: "An error occurred" });
    }
})

app.listen(5000, () => {
    console.log("Server is running on localhost:5000. Thank you so much!");
});
// {
//     "CourseName":"Android App Developer",
//     "TrainerName":"Ram Sir",
//     "CourseDuretion":"1 Year",
//     "CourseDiscription":"Very Nice Course .."
 
    
//  }