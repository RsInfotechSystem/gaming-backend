const stockServices = require("../../db.services.js/stock.service");


const getMaterialForInventory = async (request, response) => {
    try {
        //extract location Id from request
        const { locationId } = request;

        //extract data from request body
        const { page, searchString, blockId, categoryId, conditionType, brandId, modelId, location } = request.body;

        //get data from db & send response to client
        const result = await stockServices.getInventoryMaterial(page, searchString, blockId, categoryId, conditionType, brandId, locationId, modelId, location);
        if (result.totalPages) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Stock fetch successfully",
                ...result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Stock not available"
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
};


module.exports = getMaterialForInventory;