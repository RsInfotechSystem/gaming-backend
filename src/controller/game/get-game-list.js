const gameServices = require("../../db.services.js/game.service");


const getGameList = async (request, response) => {
    try {
        //extract data from request body
        const { page, searchString } = request.body;

        //get data from db & send response to client
        const result = await gameServices.getGameList(page, searchString);
        if (result.totalPages > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Games fetch successfully",
                ...result
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


module.exports = getGameList;