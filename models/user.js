const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['MasterAdmin', 'Manager'],
        default: 'MasterAdmin',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        console.log('New hashed password:', hashedPassword); 
        this.password = hashedPassword;
    }
    next();
});


userSchema.statics.login = async function (email, password) {
    const admin = await this.findOne({ email });
    if (!admin) {
        throw Error('Incorrect email');
    }
    
    console.log('Stored hashed password:', admin.password); 
    console.log('Password provided:', password); 
    
    const auth = await bcrypt.compare(password, admin.password);
    if (!auth) {
        console.error('Password verification failed'); 
        throw Error('Incorrect password');
    }
    return admin;
};

module.exports = mongoose.model('User', userSchema);
