const cloudinary = require('cloudinary').v2
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
require("dotenv").config()

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// Configure Cloudinary Storage
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "estore",
            public_key: file.fieldname + '-' + Date.now()
        }
    }
})

// Configure Multer
const multerObj = multer({ storage: cloudinaryStorage })

module.exports = multerObj