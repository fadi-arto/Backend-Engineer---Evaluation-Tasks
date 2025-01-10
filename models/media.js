const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  Recording: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recording',
  },
  type: {
    type: String,
    enum: ['audio', 'video', 'image'],
    required: true
  }
}, { timestamps: true });

const Media = mongoose.model('Media', mediaSchema); 
module.exports = Media;
