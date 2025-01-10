var express = require('express');
var router = express.Router();

const { registerAdmin, loginAdmin} = require('../controllers/userControllers')



router.post('/auth/login', loginAdmin);
router.post('/admin/register-admin',   registerAdmin);

module.exports = router;
