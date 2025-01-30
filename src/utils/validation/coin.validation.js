const Joi = require("joi");


exports.createCoinValidation = Joi.object().keys({
    valuePerCoin: Joi.number().required(),
});

exports.updateCoinValidation = Joi.object().keys({
    coinId: Joi.string().length(36).required(),
    valuePerCoin: Joi.number().required(),
});

exports.deleteCoinValidation = Joi.object().keys({
    coinId: Joi.string().length(36).required(),
});