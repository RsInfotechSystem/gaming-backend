const stockServices = require("../../db.services.js/stock.service");


const stockOutGraphList = async (request, response) => {
    try {
        //extract data from request body
        const { date, page, searchString } = request.body;

        //get data from db & send response to client
        const result = await stockServices.getStockOutMaterialList(date, page, searchString);
        if (result.totalPages > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "data fetch successfully",
                ...result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "data not available",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = stockOutGraphList;