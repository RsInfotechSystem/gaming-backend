const stockServices = require("../../db.services.js/stock.service");

const getStockList = async (request, response) => {
    try {
        //extract locationId from request
        const { locationId } = request;

        //extract data from request body
        const { page, searchString, blockId, categoryId, conditionType, brandId, location } = request.body;

        //get data from db & send response to client
        const result = await stockServices.getStockList(page, searchString, blockId, categoryId, conditionType, brandId, locationId, location);
        if (result.totalPages > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Stock fetch successfully",
                ...result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "stock not available",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
};


module.exports = getStockList;