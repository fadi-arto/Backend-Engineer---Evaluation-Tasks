const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const path = require('path');


let gfsBucket = null;

// تهيئة gfsBucket عند فتح الاتصال
mongoose.connection.once('open', () => {
    console.log('MongoDB connection is open for GridFS');
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads', // اسم مجموعة GridFS
    });
});

const storage = new GridFsStorage({
  url: process.env.DB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `file_${Date.now()}${path.extname(file.originalname)}`;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads',
      };
      resolve(fileInfo);
    });
  },
});

module.exports = { getGfsBucket: () => gfsBucket, storage };