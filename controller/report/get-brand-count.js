const stockServices = require("../../db.services.js/stock.service");


const getBrandCount = async (request, response) => {
    try {
        //extract locationId from request
        const { locationId } = request;

        //get data from db & send response to client
        const brandCount = await stockServices.getBrandCount(locationId);
        if (brandCount) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Brand count fetch successfully",
                brandCount
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Brand not available"
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = getBrandCount;