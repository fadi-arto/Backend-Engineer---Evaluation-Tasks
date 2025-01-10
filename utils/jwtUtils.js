const jwt = require('jsonwebtoken');
const Token = require('../models/token')
const config = require('../config/config');
const crypto = require('crypto');

const encrypt = (text, secret) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (encrypted, secret) => {
    try {
        if (!encrypted || typeof encrypted !== 'string' || !encrypted.includes(':')) {
            throw new Error('Invalid encrypted data format');
        }
        const textParts = encrypted.split(':');
        if (textParts.length !== 2) {
            throw new Error('Invalid encrypted data format');
        }
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = textParts.join(':');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret, 'hex'), iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error.message, error.stack);
        throw error;
    }
};


const createUserTokens = async (userId) => {
    try {
        const accessToken = jwt.sign({ id: userId, role: 'user' }, config.jwtSecret, { expiresIn: '2h' });
        const refreshToken = jwt.sign({ id: userId, role: 'user' }, config.jwtRefreshSecret, { expiresIn: '7d' });

        const token = new Token({ userId, role: 'user', accessToken, refreshToken });
        await token.save();

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Token creation error:', error.message);
        throw error;
    }
};

const createAdminTokens  = async (adminId, role) => {
    try {
        const accessToken = jwt.sign({ id: adminId, role }, config.jwtSecret, { expiresIn: '2h' });
        const refreshToken = jwt.sign({ id: adminId, role }, config.jwtRefreshSecret, { expiresIn: '7d' });

        let token = await Token.findOne({ userId: adminId, role });

        if (token) {
            token.accessToken = accessToken;
            token.refreshToken = refreshToken;
        } else {
            token = new Token({ userId: adminId, role, accessToken, refreshToken });
        }

        await token.save(); 

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Token creation error:', error.message);
        throw error;
    }
};




const handleErrors = (err) => {
    let errors = { message: 'An error occurred' };

    if (err.message.includes('Incorrect number')) {
        errors.message = 'Incorrect number';
    }
    if (err.message.includes('Incorrect password')) {
        errors.message = 'Incorrect password';
    }
    if (err.message.includes('User validation failed')) {
        errors.message = 'User validation failed';
    }

    return errors;
};

module.exports = { createUserTokens,  handleErrors,createAdminTokens, encrypt, decrypt };
