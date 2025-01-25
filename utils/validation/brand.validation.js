const Joi = require("joi");

exports.brandValidation = Joi.object().keys({
    name: Joi.string().required(),
    categoryId: Joi.string().length(36).required()
});


exports.brandIdsValidationSchema = Joi.object().keys({
    brandIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
});


exports.updateBrandValidation = Joi.object().keys({
    brandId: Joi.string().length(36).required(),
    name: Joi.string().required(),
    categoryId: Joi.string().length(36).required()
});