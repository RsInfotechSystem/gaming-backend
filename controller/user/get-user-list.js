const userServices = require("../../db.services.js/user.service");

const getUserList = async (request, response) => {
    try {
        const { id } = request;

        //extract data from request body
        const { page, searchString } = request.body;

        //get data from db & send response to client
        const result = await userServices.getUserList(id, page, searchString);

        if (result?.totalPages) {
            response.status(200).json({
                status: "SUCCESS",
                message: "User fetch successfully",
                ...result
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "User not available",
            });
            return;
        }
    } catch (error) {
        response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
        return;
    }
};


module.exports = getUserList;