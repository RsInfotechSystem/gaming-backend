const stockServices = require("../../db.services.js/stock.service");


const getNonReplacableStockList = async (request, response, next) => {
    try {
        //extract data from request body
        const { locationId } = request;

        //extract data from request body
        const { page, searchString, blockId, categoryId, conditionType, brandId, location } = request.body;

        //get data from db & send response to client
        const result = await stockServices.getNonReplacableStockList(page, searchString, locationId, blockId, categoryId, conditionType, brandId, location);
        if (result?.totalPages) {
            return response.status(200).json({
                status: "SUCCESS",
                message: `Stock fetched successfully`,
                ...result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Stock not exist",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
}


module.exports = getNonReplacableStockList;