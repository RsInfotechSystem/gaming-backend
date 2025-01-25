const stockServices = require("../../db.services.js/stock.service");
const { idValidation } = require("../../utils/validation/role.validation");


const changeStockStatus = async (request, response) => {
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

        //check stock exist or not
        const isExist = await stockServices.getStockById(stockId);
        if (!isExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Stock does not exist"
            })
        };

        const status = isExist.isActive === true ? 'disable' : "enable";

        if (status?.toLowerCase() === "disable") {
            //check stock status before disable it
            if (isExist?.stockStatus?.toLowerCase() !== "new") {
                return response.status(200).json({
                    status: "FAILED",
                    message: `You can not  ${status} stock with status : ${isExist?.stockStatus?.toLowerCase()}.`
                })
            }
        }

        const dataToUpdate = {
            isActive: !isExist.isActive
        };

        //update data into db and send response to client
        const result = await stockServices.updateStockDetail(stockId, dataToUpdate);
        if (result[0] > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: `Stock mark as ${status} successfully`
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: `Failed to mark stock as ${status}`
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    };
};


module.exports = changeStockStatus;