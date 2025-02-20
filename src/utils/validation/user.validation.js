const Joi = require("joi");

//?----------Create user validation--------------
exports.createUserValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Invalid mobile number format',
    }),
    password: Joi.string().required(),
    roleId: Joi.string().length(36).required(),
});


//?-----------Login Validation---------------------
exports.loginValidationSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
});


//?-----------Update User Validation------------------
exports.updateUserValidation = Joi.object().keys({
    userId: Joi.string().length(36).required(),
    name: Joi.string().allow(""),
    email: Joi.string().email().allow(""),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).allow("").messages({
        'string.pattern.base': 'Invalid mobile number format',
    }),
    roleId: Joi.string().length(36).allow("")
});


exports.userIdsValidationSchema = Joi.object().keys({
    userIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
})

exports.resetPasswordValidationSchema = Joi.object().keys({
    userId: Joi.string().length(36).required(),
})