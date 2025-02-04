const Joi = require("joi");

exports.createGameValidation = Joi.object().keys({
    // name, description, title, userId, contestIds, playedCount
    name: Joi.string().required(),
    description: Joi.string(),
    title: Joi.string().required(),
});

exports.updateGameValidation = Joi.object().keys({
    gameId: Joi.string().length(36).required(),
    name: Joi.string().required(),
    description: Joi.string(),
    title: Joi.string().required(),
    oldGameFiles: Joi.array().items().allow(null, "").optional(),
});

exports.gameIdsValidationSchema = Joi.object().keys({
    gameIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
})

