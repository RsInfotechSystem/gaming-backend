const blockServices = require("../../db.services.js/block.service");
const brandServices = require("../../db.services.js/brand.service");
const categoryServices = require("../../db.services.js/category.service");
const locationServices = require("../../db.services.js/location.service");
const stockServices = require("../../db.services.js/stock.service");
const { stockInValidation } = require("../../utils/validation/stock.validation");



const stockIn = async (request, response) => {
    try {
        //extract data from request
        const id = request.id;

        //extract data from request body
        const { locationId, blockId, categoryId, brandId, conditionType, status, itemCode, serialNo, quantity } = request.body;

        //check validation
        const validationResult = await stockInValidation.validate({ locationId, blockId, categoryId, brandId, conditionType, status, itemCode, serialNo, quantity }, { abortEarly: true });
        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
        };

        //check location exist or not
        const isLocationExist = await locationServices.getLocationById(locationId)
        if (!isLocationExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Location not available",
            });
        };

        //check brand exist or not
        const isBrandExist = await brandServices.getBrandById(brandId)
        if (!isBrandExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "brand not exist",
            });
        };

        //check category exist or not
        const isCategoryExist = await categoryServices.getCategoryById(categoryId);
        if (!isCategoryExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "category not available",
            });
        };

        //check block exist or not
        const isBlockExist = await blockServices.getBlockById(blockId);
        if (!isBlockExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Block not available",
            });
        };

        //check selected serialNo is already exist or not
        const isSerialNoStockExist = await stockServices.getSerialNoWiseStockData(serialNo?.toString());
        if (isSerialNoStockExist) {
            return response.status(200).json({
                status: "FAILED",
                message: `Serial no ${serialNo} is already exist.`
            })
        };

        //check selected itemCode is already exist or not
        const isItemCodeStockExist = await stockServices.getItemCodeWiseStockData(itemCode?.toString());
        if (isItemCodeStockExist) {
            return response.status(200).json({
                status: "FAILED",
                message: `Itemcode ${itemCode} is already exist.`
            })
        };

        const dataToInsert = {
            locationId,
            blockId,
            categoryId,
            brandId,
            conditionType,
            status,
            itemCode: itemCode ? itemCode : null,
            serialNo: serialNo ? serialNo : null,
            quantity,
            remainingQuantity: quantity,
            isActive: true,
            logs: [],
            stockInBy: id,
            assignedTo: null,
            stockStatus: status,
            amount: null
        };

        //insert data into db & send response to client
        const result = await stockServices.addStock(dataToInsert);
        if (result && result.dataValues && result.dataValues.id) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Stock added successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to add stock, Please try again!"
            })
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = stockIn;