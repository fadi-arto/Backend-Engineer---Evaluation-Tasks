const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    dbURI: process.env.DB_URI,
    encryptionSecret: process.env.ENCRYPTION_SECRET,
};