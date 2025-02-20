const walletServices = require("../../db.services.js/wallet.service");
const playerServices = require("../../db.services.js/player.service");
const {createValidationSchema} = require("../../utils/validation/wallet.validation");

const createWallet = async (request, response) => {
    try{
        const {playerId} = request.body;

        const validationResult = await createValidationSchema.validate({playerId}, {abortEarly : true});
        if(validationResult.error){
            return response.status(200).json({
                status : "FAILED",
                message : validationResult?.error?.details[0]?.message
            });
        }

        const isPlayerExist = await playerServices.getPlayerById(playerId);
        if(!isPlayerExist){
            return response.status(200).json({
                status : "FAILED",
                message : "Player does not exist"
            });
        }

        const isWalletExist = await walletServices.getWalletByPlayerId(playerId);
        if(isWalletExist){
            return response.status(200).json({
                status : "FAILED",
                message : "Wallet already exist for this player"
            });
        }

        const walletData = {
            playerId : playerId
        }

        const result = await walletServices.createWallet(walletData);
        if(!result){
            return response.status(200).json({
                status : "FAILED",
                message : "Wallet creation Failed, Please try again !"
            });
        }

        return response.status(200).json({
            status : "SUCCESS",
            message : "Wallet created sucessfully"
        })
    }catch(error){
        return response.status(500).json({
            status : "FAILED",
            message : error.message
        })
    }
}

module.exports = createWallet;