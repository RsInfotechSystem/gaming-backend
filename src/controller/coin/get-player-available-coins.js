const playerServices = require("../../db.services.js/player.service");

const getPlayerAvailableCoins = async (request, response) => {
    try {
        const { id } = request;
        const coins = await playerServices.getPlayerById(id);
        if (coins?.id) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Coin fetch successfully",
                coin: coins?.availableCoins ?? 0,
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Coins not available",
            });
        }

    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
};

module.exports = getPlayerAvailableCoins;
