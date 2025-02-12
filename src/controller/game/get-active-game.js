const gameServices = require("../../db.services.js/game.service");


const getActiveGames = async (request, response) => {
    try {
        //get data from db & send response to client
        const games = await gameServices.getActiveGame();
        if (games.length > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Games fetch successfully",
                games
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Games not available",
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


module.exports = getActiveGames;