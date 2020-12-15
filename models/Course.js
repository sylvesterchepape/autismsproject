var mongoose = require("mongoose");


var CourseSchema = new mongoose.Schema({
    name: String,
    subject:String,
    images: [
        {
        url:String,
        filename:String
    }
],
    video :String,
    contentNo:Number,
    description: String
    
 })  ; 

 module.exports = mongoose.model('Course',CourseSchema);