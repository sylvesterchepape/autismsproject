const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:'Autism',
        allowedFormat:['jpeg','png','jpg']
    }, params:{
        folder:'Autism_courses',
        allowedFormat:['MP4','MOV','WebM',' AVI']
    }
  
});

module.exports={
    cloudinary,
    storage
}