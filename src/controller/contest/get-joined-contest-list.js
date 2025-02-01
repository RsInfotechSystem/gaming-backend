const contestServices = require("../../db.services.js/contest.service");
const playerServices = require("../../db.services.js/player.service");


const getJoinedContestList = async (request, response) => {
    try {
        const { id } = request;
        //extract data from request body
        const { page, searchString } = request.body;

        //check player already exist Id or not
        const isPlayerExist = await playerServices.getPlayerById(id);

        //get data from db & send response to client
        const result = await contestServices.getJoinedContestList(page, searchString, isPlayerExist?.dataValues?.joinedContests);
        if (result.totalPages > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Contest fetch successfully",
                ...result
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Contest not available",
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


module.exports = getJoinedContestList;