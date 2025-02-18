const contestServices = require("../../db.services.js/contest.service");
const playerServices = require("../../db.services.js/player.service");

const getContestWisePlayerList = async (request, response) => {
    try {
        const { page, searchString, contestId } = request.body;

        //check role exist or not
        const isContestExist = await contestServices.getContestById(contestId);

        const list = await playerServices.getContestWisePlayerList(page, searchString, isContestExist?.dataValues?.joinedPlayers);

        if (list?.totalPages) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Player list fetched successfully",
                ...list,
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Player list not available",
            });
        }

    } catch (error) {
        console.log("error:",error);
        
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

module.exports = getContestWisePlayerList;