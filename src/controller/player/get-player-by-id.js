const playerServices = require("../../db.services.js/player.service");
const { idValidation } = require("../../utils/validation/player.validation");

const getPlayerById = async (request, response) => {
    try {
        const { id } = request.body;

        if (!id) {
            return response.status(200).json({
                status: "FAILED",
                message: "Id is required",
            });
        }

        const validationResult = await idValidation.validate(
            { id },
            { abortEarly: true }
        );
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        const isPlayerExist = await playerServices.getPlayerById(id);
        if (!isPlayerExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Player does not exist",
            });
        }
        return response.status(200).json({
            status: "SUCCESS",
            message: "Player found successfully",
            player: isPlayerExist,
        });
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

module.exports = getPlayerById;