const stockServices = require("../../db.services.js/stock.service");

const getCategoryCount = async (request, response) => {
    try {
        //extract locationId from request
        const { locationId } = request;

        //get data from db & send response to client
        const categoryCount = await stockServices.getCategoryCount(locationId);
        if (categoryCount) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Category count fetch successfully",
                categoryCount
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Category not available"
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = getCategoryCount;