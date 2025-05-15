const multer = require('multer')
const {CloudinaryStorage}=require('multer-storage-cloudinary')
const cloudinary=require('./Cloudinary')
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'VishalUploads',
        allowedFormats: ['jpg', 'png', 'gif','jpeg','svg'],
        resource_type: 'image',
        },

})
const upload=multer({storage});
module.exports=upload;