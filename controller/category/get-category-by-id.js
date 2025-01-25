const categoryServices = require("../../db.services.js/category.service");
const { idValidation } = require("../../utils/validation/role.validation");


const getCategoryById = async (request, response) => {
    try {
        //extract categoryId from request body
        const categoryId = request.body.categoryId;

        //check validation
        const validationResult = await idValidation.validate({ id: categoryId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        };

        //check category exist or not
        const category = await categoryServices.getCategoryById(categoryId);
        if (category) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Category details fetched successfully",
                category
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Category is not available."
            });
            return;
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = getCategoryById;