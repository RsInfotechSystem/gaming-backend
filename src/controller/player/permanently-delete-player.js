const playerServices = require("../../db.services.js/player.service");
const { idValidation } = require("../../utils/validation/player.validation");

const deletePlayerPermanently = async (request, response) => {
    try{
        //extract data from request body
        const { playerId} = request.body;

        if (!playerId) {
            return response.status(200).json({
                status: "FAILED",
                message: "Player Id required",
            });
        }

        const validationResult = await idValidation.validate({ id: playerId }, { abortEarly: true });

        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
        }

        const isPlayerExist = await playerServices.getPlayerById(playerId);
        if (!isPlayerExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Player does not exist",
            });
        }

        const deletedPlayer = await playerServices.deletePlayerPermanently(playerId);
        
        if(deletedPlayer){
            return response.status(200).json({
                status: "SUCCESS",
                message: "Player deleted successfully",
            });
        }else{
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to delete player please try again",
            });
        }
    }catch(error){
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

module.exports = deletePlayerPermanently;