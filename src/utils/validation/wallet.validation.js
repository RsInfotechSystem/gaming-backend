const Joi = require("joi");

exports.createValidationSchema = Joi.object().keys({
    playerId: Joi.string().length(36).required(),
});