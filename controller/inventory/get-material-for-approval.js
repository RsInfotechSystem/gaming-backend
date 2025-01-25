const stockServices = require("../../db.services.js/stock.service");

const getMaterialForApproval = async (request, response) => {
    try {
        //extract data from request body
        const { page, searchString, } = request.body;

        //get data from db & send response to client
        const result = await stockServices.getSellToApprove(page, searchString);
        if (result.totalPages) {
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


module.exports = getMaterialForApproval;