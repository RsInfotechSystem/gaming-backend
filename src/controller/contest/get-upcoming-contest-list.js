const contestServices = require("../../db.services.js/contest.service");

const getUpcomingContestList = async (request, response) => {
    try{
        const {page} = request.body;

        const contestList = await contestServices.getUpcomingContestList(page);
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
        return response.staus(500).json({
            status : "FAILED",
            message : error.message 
        })
    }
}

module.exports = getUpcomingContestList