const Joi = require("joi");

exports.createContestValidation = Joi.object().keys({
    // name, description, title, userId, contestIds, playedCount
    name: Joi.string().required(),
    description: Joi.string().required(),
    gameId: Joi.string().length(36).required(),
    gameType: Joi.string().required(),
    contestDate: Joi.date().required(),
    contestTime: Joi.string().required(),
    reqCoinsToJoin: Joi.number().required(),
    winningPrice: Joi.number().required(),
    playersLimit: Joi.number().required(),
    noOfWinners: Joi.number().required(),
});


exports.updateContestValidation = Joi.object().keys({
    contestId: Joi.string().length(36).required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    gameId: Joi.string().length(36).required(),
    gameType: Joi.string().required(),
    contestDate: Joi.date().required(),
    contestTime: Joi.string().required(),
    reqCoinsToJoin: Joi.number().required(),
    winningPrice: Joi.number().required(),
    playersLimit: Joi.number().required(),
    roomId: Joi.string().allow(null, "").optional(),
    passwordToJoin: Joi.string().allow(null, "").optional(),
    oldContestFiles: Joi.array().items().allow(null, "").optional(),
});

exports.contestIdsValidationSchema = Joi.object().keys({
    contestIds: Joi.array().min(1).items(Joi.string().length(36).required()).required()
})

exports.joinContestValidation = Joi.object().keys({
    contestId: Joi.string().length(36).required(),
    gameUserName: Joi.string().required(),
})

exports.declareWinnerValidation = Joi.object().keys({
    contestId: Joi.string().length(36).required(),
    playerId: Joi.string().length(36).required(),
})

exports.addRoomIdvalidation = Joi.object().keys({
    contestId: Joi.string().length(36).required(),
    roomId: Joi.string().required(),
    password: Joi.string().required(),
})
