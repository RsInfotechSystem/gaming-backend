const blockServices = require("../../db.services.js/block.service");
const brandServices = require("../../db.services.js/brand.service");
const categoryServices = require("../../db.services.js/category.service");
const locationServices = require("../../db.services.js/location.service");
const stockServices = require("../../db.services.js/stock.service");
const { updateStockValidation } = require("../../utils/validation/stock.validation");


const updateStockIn = async (request, response) => {
    try {
        //extract data from request
        const { id, name } = request;

        //extract data from request body
        const { stockId, locationId, blockId, categoryId, brandId, conditionType, status, itemCode, serialNo, quantity } = request.body;

        //check validation
        const validationResult = await updateStockValidation.validate({ stockId, locationId, blockId, categoryId, brandId, conditionType, status, itemCode, serialNo, quantity }, { abortEarly: true });
        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
        }

        //check stock entry exist or not
        const isStockExist = await stockServices.getStockById(stockId)
        if (!isStockExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Stock entry not available",
            });
        };

        //check stock already exist with item code
        const existingStock = await stockServices.getExistingStockByItemCode(stockId, itemCode);
        if (existingStock) {
            return response.status(200).json({
                status: "FAILED",
                message: `Stock already exist with ${existingStock?.itemCode} item code.`
            });
        }

        //check material return or stock-out or not
        if (["stock out", "return"].includes(isStockExist?.stockStatus)) {
            return response.status(200).json({
                status: "FAILED",
                message: `You can not update ${isStockExist?.stockStatus} material.`,
            });
        }

        //check location exist or not
        const isLocationExist = await locationServices.getLocationById(locationId)
        if (!isLocationExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Location not available",
            });
        }

        //check brand exist or not
        const isBrandExist = await brandServices.getBrandById(brandId)
        if (!isBrandExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "brand not exist",
            });
        }


        //check category exist or not
        const isCategoryExist = await categoryServices.getCategoryById(categoryId);
        if (!isCategoryExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "category not available",
            });
        }

        //check block exist or not
        const isBlockExist = await blockServices.getBlockById(blockId);
        if (!isBlockExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Block not available",
            });
        }


        const dataToUpdate = {
            locationId,
            blockId,
            categoryId,
            brandId,
            conditionType,
            status,
            itemCode,
            serialNo,
            quantity,
            logs: [...isStockExist.logs,
            {
                "actionDate": new Date(),
                "action": "update",
                "updatedBy": id,
                "message": `stock entry updated by ${name}`
            }
            ],
        }

        //update data into db & send response to client
        const result = await stockServices.updateStockDetail(stockId, dataToUpdate);
        if (result[0] > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "stock updated successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to update stock, Please try again!",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
};


module.exports = updateStockIn;