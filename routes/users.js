var express = require('express');
var router = express.Router();

const { registerAdmin, loginAdmin} = require('../controllers/userControllers')



router.post('/api/users/auth/login', loginAdmin);
router.post('/api/users/admin/register-admin',   registerAdmin);

module.exports = router;
