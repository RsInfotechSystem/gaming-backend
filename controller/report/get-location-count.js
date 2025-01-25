const stockServices = require("../../db.services.js/stock.service");


const getLocationCount = async (request, response) => {
    try {
        //extract locationId from request
        const { locationId } = request;

        //get data from db & send response to client
        const locationCount = await stockServices.getLocationCount(locationId);
        if (locationCount) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Location count fetch successfully",
                locationCount
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Location not available"
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = getLocationCount;