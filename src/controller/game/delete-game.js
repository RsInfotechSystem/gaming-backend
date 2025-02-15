const gameServices = require("../../db.services.js/game.service");
const contestServices = require("../../db.services.js/contest.service");
const { gameIdsValidationSchema } = require("../../utils/validation/game.validation");


const deleteSelectedGames = async (request, response) => {
    try {
        //extract data from request body
        const gameIds = request.body.gameIds;

        //check validation
        const validationResult = await gameIdsValidationSchema.validate({ gameIds }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        const arrayLength = gameIds?.length;
        for (let i = 0; i < arrayLength; i++) {
            const role = gameIds[i];
            const isGameExist = await gameServices.getGameById(role);
            if (!isGameExist) {
                return response.status(200).json({
                    status: 'FAILED',
                    message: "Game does not exist."
                });
            };
        };

        //delete the selected Game from db and send response to client
        const result = await gameServices.deleteGame(gameIds);
        if (result > 0) {
            for(i = 0 ; i < gameIds?.length; i++){
                const gameId = gameIds[i];
                await contestServices.deleteContestByGameId(gameId);
            }
            return response.status(200).json({
                status: 'SUCCESS',
                message: 'Games and related contests deleted successfully.'
            });
        } else {
            return response.status(200).json({
                status: 'FAILED',
                message: 'Failed to delete games.'
            });
        };
    } catch (error) {     
        return response.status(500).json({
            status: 'FAILED',
            message: error.message
        });
    }
};


module.exports = deleteSelectedGames;