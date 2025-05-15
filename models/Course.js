const mongoose= require("mongoose");
const slugify=require('slugify')
const user2Schema =new mongoose.Schema({
    Title:{type:String,required:true
},TrainerName:{
type:String,required:true,unique:false
},CourseDuretion:{
    type:String,required:true
},
CourseDiscription:{type:String,required:true},
Category:{type:String,required:true},
Discountpercentage:{type:String,required:true},
OfferTillDate:{type:String,required:true},
StartDate:{type:String,required:true},
EndDate:{type:String,required:true},
IsFeatured:{type:Boolean,required:true},
Banner:{type:String,required:true},
})

user2Schema.pre('save',function(next){
    if(!this.slug)
    {
        this.slug=slugify(this.Title)
    }
    next()
})

const user2=mongoose.model('User2',user2Schema);
module.exports=user2;