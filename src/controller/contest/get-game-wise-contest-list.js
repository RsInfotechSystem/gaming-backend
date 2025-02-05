const contestServices = require("../../db.services.js/contest.service");

const getGameWiseContestList =async (request, response) => {
    try{

        const {page, searchString, gameId} = request.body

        if(!gameId){
            return response(200).json({
                status : "FAILED",
                message : "Game ID is missing"
            });
        }

        const contestList = await contestServices.getGameWiseContestList(page,searchString,gameId)
        if (contestList.totalPages > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Contest fetch successfully",
                ...contestList
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

module.exports = getGameWiseContestList