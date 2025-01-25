const stockServices = require("../../db.services.js/stock.service");
const { idValidation } = require("../../utils/validation/role.validation");


const getStockByCategoryId = async (request, response) => {
    try {
        //extract locationId from request
        const { locationId } = request;

        //extract data from request body
        const { categoryId, page, searchString } = request.body;

        //check validation
        const validationResult = await idValidation.validate({ id: categoryId }, { abortEarly: true });
        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
        }

        //get data from db & send response to client
        const result = await stockServices.getStockByCategoryId(categoryId, locationId, page, searchString);
        if (result?.totalPages) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Stock fetched successfully",
                ...result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Stock not available."
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = getStockByCategoryId;