const brandServices = require("../../db.services.js/brand.service");
const categoryServices = require("../../db.services.js/category.service");
const { brandValidation } = require("../../utils/validation/brand.validation");

const createBrand = async (request, response) => {
    try {
        //extract data from request body
        const { name, categoryId } = request.body;

        //check validation
        const validationResult = await brandValidation.validate({ name, categoryId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //check category exist or not
        const isCategoryExist = await categoryServices.getCategoryById(categoryId);
        if (!isCategoryExist) {
            response.status(200).json({
                status: "FAILED",
                message: "category not exist",
            });
            return;
        };

        //check brand already exist
        const isBrandExist = await brandServices.getBrandByName(name, categoryId);
        if (isBrandExist) {
            response.status(200).json({
                status: "FAILED",
                message: "Brand already exist with given name for selected category",
            });
            return;
        }

        const dataToInsert = {
            name: name?.toLowerCase(),
            categoryId,
            isDeleted: false,
        };

        //insert data into db & send response to client
        const result = await brandServices.createBrand(dataToInsert);
        if (result && result.dataValues && result.dataValues.id) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Brand added successfully",
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Failed to add brand, Please try again!",
            });
            return;
        }
    } catch (error) {
        response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
        return;
    }
};


module.exports = createBrand;