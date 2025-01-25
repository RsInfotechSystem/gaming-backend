const categoryServices = require("../../db.services.js/category.service");
const { updateCategoryValidation } = require("../../utils/validation/category.validation");

const updateCategory = async (request, response) => {
    try {
        //extract data from request body
        const { categoryId, name } = request.body;

        //check validation
        const validationResult = await updateCategoryValidation.validate({ categoryId, name }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        //check category exist or not
        const isExist = await categoryServices.getCategoryById(categoryId);
        if (!isExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Category does not exist"
            });
        };

        //ensure category should not be similar to the existing one
        const existingCategory = await categoryServices.getExistingCategoryByName(categoryId, name?.toLowerCase());
        if (existingCategory) {
            response.status(200).json({
                status: "FAILED",
                message: `${name} category is already exist.`
            });
            return;
        }

        const dataToUpdate = {
            name: name?.toLowerCase()
        };

        //update data into db and send response to client
        const result = await categoryServices.updateCategoryDetails(categoryId, dataToUpdate);
        if (result[0] > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Category details updated successfully"
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Failed to update details"
            });
            return;
        };
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};


module.exports = updateCategory;