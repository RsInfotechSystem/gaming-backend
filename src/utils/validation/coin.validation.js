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

exports.purchaseCoinValidation = Joi.object().keys({
    coinId: Joi.string().length(36).required(),
    TransactionId: Joi.string().required(),
    name: Joi.string().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Invalid mobile number format',
    }),
    email: Joi.string().email().required(),

})