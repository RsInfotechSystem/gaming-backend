const contestServices = require("../../db.services.js/contest.service");


const getContestWinsList = async (request, response) => {
    try {
        const { id } = request
        //extract data from request body
        const { page, searchString } = request.body;

        //get data from db & send response to client
        const result = await contestServices.getContestWinsList(page, searchString, id);
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


module.exports = getContestWinsList;