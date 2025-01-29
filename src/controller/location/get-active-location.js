const locationServices = require("../../db.services.js/location.service");


const getActiveLocations = async (request, response) => {
    try {
        //get data from db & send response to client
        const result = await locationServices.getActiveLocationsList();
        if (result?.length > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Location fetched successfully.",
                location: result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Location does not exist."
            });
        };
    } catch (error) {
        return response.status(500).json({
            status: 'FAILED',
            message: error.message
        });
    }
};


module.exports = getActiveLocations;