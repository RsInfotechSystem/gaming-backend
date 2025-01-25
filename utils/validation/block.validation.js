const Joi = require("joi");

exports.blockValidation = Joi.object().keys({
    locationId: Joi.string().length(36).required(),
    blockNo: Joi.string().required()
});


exports.updateBlockValidation = Joi.object().keys({
    blockId: Joi.string().length(36).required(),
    locationId: Joi.string().length(36).required(),
    blockNo: Joi.string().required()
});


exports.blockIdsValidationSchema = Joi.object().keys({
    blockIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
});