const gameServices = require("../../db.services.js/game.service");
const { idValidation } = require("../../utils/validation/role.validation");


const getGameById = async (request, response) => {
    try {
        //extract gameId from request body
        const gameId = request.body.gameId;

        //check validation
        const validationResult = await idValidation.validate({ id: gameId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        };

        //check role exist or not
        const game = await gameServices.getGameById(gameId);

        if (game?.id) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Game details fetched successfully",
                game
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Game does not exist"
            });
            return;
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};

module.exports = getGameById;