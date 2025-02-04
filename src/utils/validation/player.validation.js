const Joi = require('joi');

exports.createPlayerValidation = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().regex(/^[0-9]{10}$/).required(),
    dob: Joi.date().required(),
    userName: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
});

exports.idValidation = Joi.object().keys({
    id: Joi.string().length(36).required()
});

exports.updatePlayerValidation = Joi.object().keys({
    playerId: Joi.string().length(36).required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().regex(/^[0-9]{10}$/).required(),
    dob: Joi.date().required(),
    userName: Joi.string().required(),
});

exports.loginPlayerValidation = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});