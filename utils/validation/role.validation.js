const Joi = require("joi");


exports.createRoleValidation = Joi.object().keys({
    name: Joi.string().required(),
    tab: Joi.array().min(1).items().required(),
});


exports.idValidation = Joi.object().keys({
    id: Joi.string().length(36).required()
})


exports.updateRoleValidation = Joi.object().keys({
    roleId: Joi.string().length(36).required(),
    name: Joi.string().required(),
    tab: Joi.array().min(1).items().required(),
});


exports.roleIdsValidationSchema = Joi.object().keys({
    roleIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
})