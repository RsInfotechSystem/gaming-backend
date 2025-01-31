const contestServices = require("../../db.services.js/contest.service");


const getActiveContest = async (request, response) => {
    try {
        //get data from db & send response to client
        const result = await contestServices.getActiveContest();
        if (result?.length > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Contest fetched successfully.",
                contests: result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Contest does not exist."
            });
        };
    } catch (error) {
        return response.status(500).json({
            status: 'FAILED',
            message: error.message
        });
    }
};


module.exports = getActiveContest