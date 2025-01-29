const roleServices = require("../../db.services.js/role.service");


const getRoleList = async (request, response) => {
    try {
        //extract data from request body
        const { page, searchString } = request.body;

        //get data from db & send response to client
        const result = await roleServices.getRoleList(page, searchString);
        if (result.totalPages > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Role fetch successfully",
                ...result
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Role not available",
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


module.exports = getRoleList;