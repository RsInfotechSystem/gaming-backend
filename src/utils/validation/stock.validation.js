const Joi = require("joi");

exports.stockInValidation = Joi.object().keys({
    locationId: Joi.string().length(36).required(),
    blockId: Joi.string().length(36).required(),
    categoryId: Joi.string().length(36).required(),
    brandId: Joi.string().length(36).required(),
    conditionType: Joi.string().required(),
    status: Joi.string().required(),
    itemCode: Joi.string().allow(null, "").optional(),
    serialNo: Joi.string().allow(null, "").optional(),
    quantity: Joi.number().integer().required()
});


exports.updateStockValidation = Joi.object().keys({
    stockId: Joi.string().length(36).required(),
    locationId: Joi.string().length(36).required(),
    blockId: Joi.string().length(36).required(),
    categoryId: Joi.string().length(36).required(),
    brandId: Joi.string().length(36).required(),
    status: Joi.string().required(),
    conditionType: Joi.string().required(),
    itemCode: Joi.string().allow(null, "").optional(),
    serialNo: Joi.string().allow(null, "").optional(),
    quantity: Joi.number().integer().required(),
});


exports.stockIdsValidationSchema = Joi.object().keys({
    stockIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
});


exports.sellMaterialValidation = Joi.object().keys({
    stockId: Joi.string().length(36).required(),
    quantity: Joi.number().integer().required(),
});


exports.reportIdsValidation = Joi.object().keys({
    type: Joi.string().required(),
    categoryId: Joi.when('type', {
        is: "category",
        then: Joi.string().length(36).required(),
        otherwise: Joi.allow("", null).optional(),
    }),
    brandId: Joi.when('type', {
        is: "brand",
        then: Joi.string().length(36).required(),
        otherwise: Joi.allow("", null).optional(),
    }),
    location: Joi.when('type', {
        is: "location",
        then: Joi.string().length(36).required(),
        otherwise: Joi.allow("", null).optional(),
    }),
    status: Joi.when('type', {
        is: "status",
        then: Joi.string().required(),
        otherwise: Joi.allow("", null).optional(),
    }),
});


exports.stockIdsValidationSchema = Joi.object().keys({
    type: Joi.string().required(),
    stockId: Joi.when('type', {
        is: "single",
        then: Joi.string().length(24).required(),
        otherwise: Joi.allow("", null).optional(),
    }),
});