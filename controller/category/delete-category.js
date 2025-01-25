const categoryServices = require("../../db.services.js/category.service");
const { categoryIdsValidationSchema } = require("../../utils/validation/category.validation");


const deleteSelectedCategory = async (request, response) => {
    try {
        //extract data from request body
        const categoryIds = request.body.categoryIds;

        //check validation
        const validationResult = await categoryIdsValidationSchema.validate({ categoryIds }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        const arrayLength = categoryIds?.length;
        for (let i = 0; i < arrayLength; i++) {
            const category = categoryIds[i];

            //Check category exist or not
            const isCategoryExist = await categoryServices.getCategoryById(category);
            if (!isCategoryExist) {
                return response.status(200).json({
                    status: 'FAILED',
                    message: "Category does not exist."
                });
            };

            //!Don't  remove this check
            //check category is in used or not
            // const isCategoryIsInUsed = await categoryServices.checkCategoryIsInUsed(category);
            // if (isCategoryIsInUsed?.parameterResult?.length > 0 || isCategoryIsInUsed?.stockResult?.length > 0 || isCategoryIsInUsed?.brandResult?.length > 0 || isCategoryIsInUsed?.modelResult?.length > 0) {
            //     return response.status(200).json({
            //         status: "FAILED",
            //         message: `${isCategoryExist?.name} category is in use, it cannot be deleted.`
            //     })
            // }
        };

        //delete the selected category from db and send response to client
        let result = await categoryServices.deleteSelectedCategory(categoryIds);
        if (result > 0) { 
            return response.status(200).json({
                status: "SUCCESS",
                message: "Category deleted successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Category deletion Failed. Please try again.",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: 'FAILED',
            message: error.message
        });
    }
};


module.exports = deleteSelectedCategory;