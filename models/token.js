
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role', 
        required: true
    },
    role: {
        type: String,
        enum: ['user','MasterAdmin', 'Manager'],
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 604800 
    }
}, { timestamps: true });

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;

