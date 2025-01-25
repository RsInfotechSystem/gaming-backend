const categoryServices = require("../../db.services.js/category.service");
const brandServices = require("../../db.services.js/brand.service");

const getCategoryWiseBrand = async (request, response) => {
    try {
        //extract data from request body
        const categoryId = request.body.categoryId

        //check category exist or not
        const isCategoryExist = await categoryServices.getCategoryById(categoryId);
        if (!isCategoryExist) {
            response.status(200).json({
                status: "FAILED",
                message: "Category not exist",
            });
            return;
        }

        //get data from db & send response to client
        const result = await brandServices.getCategoryWiseBrand(categoryId);
        if (result?.length > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Brand fetched successfully.",
                brand: result
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Brand does not exist."
            });
        };
    } catch (error) {
        return response.status(500).json({
            status: 'FAILED',
            message: error.message
        });
    }
};


module.exports = getCategoryWiseBrand;