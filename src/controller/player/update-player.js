const playerServices = require("../../db.services.js/player.service");
const { updatePlayerValidation } = require("../../utils/validation/player.validation");

const updatePlayer = async (request, response) => {
    try {
        //extract data from request body
        const { playerId, name, email, mobile, dob, userName } = request.body;

        if (!playerId) {
            return response.status(200).json({
                status: "FAILED",
                message: "Player Id is required",
            });
        }

        //check validation
        const validationResult = await updatePlayerValidation.validate({ playerId, name, email, mobile: mobile?.toString(), dob, userName }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //check player already exist Id or not
        const isPlayerExist = await playerServices.getPlayerById(playerId);
        if (!isPlayerExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Player does not exist",
            });
        }

        //Check if player is active or not
        if (isPlayerExist?.isActive === false) {
            return response.status(200).json({
                status: "FAILED",
                message: "You can not update disable player",
            });
        }

        //check player already exist with userName
        const isUsernameExist = await playerServices.getPlayerByUsername(userName);
        if (isUsernameExist) {
            response.status(200).json({
                status: "FAILED",
                message: "Player already exist with this username",
            });
            return;
        }

        const dataToUpdate = {
            name,
            email,
            mobile,
            dob,
            userName,
        };

        const updatedPlayer = await playerServices.updatePlayer(playerId, dataToUpdate);
        if (updatedPlayer && updatedPlayer[0] > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Player updated successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Player not updated please try again",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

module.exports = updatePlayer;