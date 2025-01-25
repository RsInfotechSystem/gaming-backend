const locationServices = require("../../db.services.js/location.service");


const getLocationList = async (request, response) => {
    try {
        //extract data from request body
        const { page, searchString } = request.body;

        // Get data from the service and send response to client
        const result = await locationServices.getLocationList(Number(page), searchString);

        if (result.totalPages > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Location fetched successfully",
                ...result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Location not available",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
};


module.exports = getLocationList;