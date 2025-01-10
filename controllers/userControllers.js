const {successResponse , errorResponse} = require('../utils/response_handler')
const {loginSchema,registerMangerSchema} = require('../utils/validationSchemas')
const { createAdminTokens } = require('../utils/jwtUtils')
const User =require('../models/user')




module.exports.registerAdmin = async (req, res) => {
    try {
        const { error } = registerMangerSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 'Validation error', error.details[0].message, 400);
        }

        const { email, password, role } = req.body;

       

        let admin = await User.findOne({ email });
        if (admin) {
            return errorResponse(res, 'User already registered', '', 400);
        }

        admin = new User({ email, password, role });
        await admin.save();

        const { accessToken, refreshToken } = await createAdminTokens(admin._id, role);

        return successResponse(res, 'Admin registered successfully', {});
    } catch (err) {
        return errorResponse(res, 'Server error', err.message, 500);
    }
};




module.exports.loginAdmin= async (req, res) => {
    try {
        console.log('Incoming request to login:', req.body); 
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return errorResponse(res, 'Validation error', error.details[0].message, 400);
        }

        const { email, password } = req.body;
        const admin = await User.login(email, password);

        const { accessToken, refreshToken } = await createAdminTokens(admin._id, admin.role);
        return successResponse(res, 'Login successful', { accessToken, role: admin.role });
    } catch (err) {
        console.error('Login error:', err.message); 
        return errorResponse(res, 'Login failed', {}, 400);
    }
};
