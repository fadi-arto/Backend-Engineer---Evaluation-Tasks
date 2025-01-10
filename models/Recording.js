const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema({
  fileUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  type: { type: String, enum: ['audio', 'video'], required: true }, 
  media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Recording', recordingSchema);