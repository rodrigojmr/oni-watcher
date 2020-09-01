const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'localista',
    allowedFormats: ['jpg', 'png'],
    use_original_filename: true
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
