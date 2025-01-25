const stockServices = require("../../db.services.js/stock.service");
const { reportIdsValidation } = require("../../utils/validation/stock.validation");


const getReportWiseMaterialList = async (request, response) => {
    try {
        //extract locationId from request
        const { locationId } = request;

        //extract data from request body
        const { categoryId, brandId, location, status, type, page, searchString, date } = request.body;

        //check validation
        const validationResult = await reportIdsValidation.validate({ categoryId, brandId, location, status, type }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //get data from db & send response to client
        let result = {}
        if (type === "category") {
            result = await stockServices.getCategoryReportMaterialList(page, searchString, categoryId, locationId, brandId, location);
        }

        if (type === "location") {
            result = await stockServices.getLocationReportMaterialList(page, searchString, location, locationId, categoryId, brandId);
        }

        if (type === "brand") {
            result = await stockServices.getBrandReportMaterialList(page, searchString, brandId, locationId, categoryId, location);
        }

        if (type === "status") {
            result = await stockServices.getStatusWiseReportMaterialList(page, searchString, status, locationId, categoryId, brandId, location);
        }

        if (type?.toLowerCase() === "graph") {
            result = await stockServices.getStockOutMaterialList(date, page, searchString, locationId, categoryId, brandId, location);
        };

        if (result.totalPages) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Material list fetch successfully",
                ...result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Material list not available"
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = getReportWiseMaterialList;