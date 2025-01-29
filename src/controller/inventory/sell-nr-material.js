const stockServices = require("../../db.services.js/stock.service");
const checkTabAccess = require("../../utils/helper/check-user-tab-access");
const { stockIdsValidationSchema } = require("../../utils/validation/stock.validation");


const sellNonReplacableStock = async (request, response, next) => {
    try {
        //extract data from request body
        const { stockId, type } = request.body;

        //check validation
        const validationResult = await stockIdsValidationSchema.validate({ stockId, type }, { abortEarly: true });
        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
        };

        //update data in db & send response to client
        const result = await stockServices.sellNRmaterial(stockId, type);
        if (result?.acknowledged && result?.matchedCount > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: `Stock sell successfully`,
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to sell material",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
}


module.exports = sellNonReplacableStock;