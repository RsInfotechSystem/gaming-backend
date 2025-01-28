const Joi = require("joi"); 

exports.createGameValidation = Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    userId: Joi.string().length(36).required(),
    title: Joi.string().required(),
    playerCount: Joi.number().required(),
    isActive: Joi.boolean().required(),
    isDeleted: Joi.boolean().required(),
});

exports.updateGameValidation = Joi.object().keys({
    gameId: Joi.string().length(36).required(),
    name: Joi.string(),
    description: Joi.string(),
    userId: Joi.string().length(36),
    title: Joi.string(),
    playerCount: Joi.number(),
    isActive: Joi.boolean(),
    isDeleted: Joi.boolean(),
});

