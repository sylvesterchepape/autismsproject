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
    videos :[
        {
        url:String,
        filename:String
    }
],
    contentNo:Number,
    description: String
    
 })  ; 

 module.exports = mongoose.model('Course',CourseSchema);