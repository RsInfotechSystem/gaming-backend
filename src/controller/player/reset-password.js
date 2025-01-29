const playerServices = require("../../db.services.js/player.service");

const resetPassword = async (request, response) => {
    try{
        //extract data from request body
        const { playerId,oldPassword, newPassword} = request.body;

        if (!playerId || !password) {
                return response.status(200).json({
                status: "FAILED",
                message: "Player Id and password is required",
            });
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

        const dataToUpdate = {
            password,
        };

        const updatedPlayer = await playerServices.updatePlayer(playerId, dataToUpdate);
        if(updatedPlayer && updatedPlayer[0] > 0){
            return response.status(200).json({
                status: "SUCCESS",
                message: "Password updated successfully",
            });
        }else{
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to update password",
            });
        }
    }catch(error){
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
}