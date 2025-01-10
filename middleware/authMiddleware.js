require('dotenv').config();
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const Token = require('../models/token')
const User = require('../models/user')
const { decrypt, createTokens } = require('../utils/jwtUtils');
const {successResponse , errorResponse} = require('../utils/response_handler')

if (!config.jwtSecret || !config.jwtRefreshSecret || !config.encryptionSecret || !config.dbURI) {
    throw new Error('Missing necessary environment variables');
}



const requireAuth  = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'No token provided or invalid format', {}, 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, config.jwtSecret);
        const { id, role } = decodedToken;

        let user;
        if (role === 'user' || ['MasterAdmin', 'Manager'].includes(role)) {
            user = await User.findById(id);
        }

        if (!user) {
            return errorResponse(res, 'User not found', {}, 401);
        }

        const tokenDoc = await Token.findOne({ accessToken: token, userId: id, role });
        if (!tokenDoc) {
            return errorResponse(res, 'Invalid or expired token', {}, 400);
        }

        req.userId = id;
        req.userRole = role;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return errorResponse(res, 'Token expired', {}, 401);
        }
        return errorResponse(res, 'Authentication failed', { details: err.message }, 401);
    }
};

module.exports = { requireAuth };