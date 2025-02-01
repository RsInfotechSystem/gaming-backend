const Joi = require("joi");


exports.createCoinValidation = Joi.object().keys({
    coinsCount: Joi.number().required(),
    rupeesAmt: Joi.number().required(),
});

exports.updateCoinValidation = Joi.object().keys({
    coinId: Joi.string().length(36).required(),
    coinsCount: Joi.number().required(),
    rupeesAmt: Joi.number().required(),
});

exports.deleteCoinValidation = Joi.object().keys({
    coinIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
});