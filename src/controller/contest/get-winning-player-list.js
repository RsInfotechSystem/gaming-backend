const contestServices = require("../../db.services.js/contest.service");

const getWinnerPlayerList = async (request, response) => {
    try{
        const {page, searchString} = request.body;

        const playerList = await contestServices.getWinnerPlayerList(page,searchString);

        if (playerList.totalPages > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Contest fetch successfully",
                ...playerList
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Contest not available",
            });
            return;
        }
    }catch(error){
        return response.status(500).json({
            status : "FAILED",
            message : error.message
        })
    }
}

module.exports = getWinnerPlayerList