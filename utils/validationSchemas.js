const Joi = require('joi');

module.exports.loginSchema = Joi.object({
    email: Joi.string().email().required().max(100),
    password: Joi.string().required().max(20)
});


module.exports.registerMangerSchema = Joi.object({
    email: Joi.string()
    .email({ minDomainSegments: 2 })
    .pattern(/^[\w.%+-]+@zoom-example\.ms$/)
    .required()
    .messages({
        'string.pattern.base': 'The email must be in the format example@zoom-example.ms'
    }),
    password: Joi.string().min(8).max(20).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' }),
    role: Joi.string().valid('MasterAdmin',  'Manager').required().label('Role'),
  
  });