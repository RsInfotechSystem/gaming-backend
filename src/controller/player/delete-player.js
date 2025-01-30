const playerServices = require("../../db.services.js/player.service.js");
const { idValidation } = require("../../utils/validation/player.validation.js");

const deletePlayerById = async (request, response) => {
  try {
    const {playerId} = request.body;

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

    const dataToUpdate = {
        isDeleted : true,
    };

    const updatedPlayer = await playerServices.updatePlayer(playerId, dataToUpdate);

    if(updatedPlayer && updatedPlayer[0] > 0){
        return response.status(200).json({
            status: "SUCCESS",
            message: "Player marked deleted successfully",
        });
    }else{
        return response.status(200).json({
            status: "FAILED",
            message: "Failed to mark player deleted",
        });
    }
  } catch (error) {
    return response.status(500).json({
        status: "FAILED",
        message: error.message,
      });
  }
};

module.exports = deletePlayerById;