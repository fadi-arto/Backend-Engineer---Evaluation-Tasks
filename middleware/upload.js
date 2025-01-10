const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const path = require('path');
const dotenv = require('dotenv');
const {errorResponse , successResponse} = require('../utils/response_handler')

dotenv.config();

const storage = new GridFsStorage({
    url: process.env.DB_URI,
    file: (req, file) => {
        if (!file || !file.originalname) {
            return null; 
        }

        const filename = `file_${Date.now()}${path.extname(file.originalname)}`;
        return {
            filename: filename,
            bucketName: 'uploads',
        };
    },
});

const upload = multer({ storage });

module.exports = { uploadFile: upload.single('file') };