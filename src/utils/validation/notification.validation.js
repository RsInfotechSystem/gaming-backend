const Joi = require("joi");

exports.notificationIdsValidationSchema = Joi.object().keys({
    notificationIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
})