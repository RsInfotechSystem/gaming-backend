const stockServices = require("../../db.services.js/stock.service");
const { idValidation } = require("../../utils/validation/role.validation");


const getStockById = async (request, response) => {
    try {
        //extract data from request body
        const { stockId } = request.body;


        //check validation
        const validationResult = await idValidation.validate({ id: stockId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        //get data from db & send response to client
        const stock = await stockServices.getStockById(stockId);
        if (stock) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Stock fetch successfully",
                stock
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "stock not available",
            });
        };
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
};


module.exports = getStockById;