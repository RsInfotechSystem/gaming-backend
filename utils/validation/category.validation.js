const Joi = require("joi");

exports.categoryValidation = Joi.object().keys({
    name: Joi.string().required()
});


exports.updateCategoryValidation = Joi.object().keys({
    categoryId: Joi.string().length(36).required(),
    name: Joi.string().required()
});


exports.categoryIdsValidationSchema = Joi.object().keys({
    categoryIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
});