const brandServices = require("../../db.services.js/brand.service");
const { idValidation } = require("../../utils/validation/role.validation");

const getBrandById = async (request, response) => {
    try {
        const brandId = request.body.brandId;

        //check validation
        const validationResult = await idValidation.validate({ id: brandId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        };

        //check brand exist or not
        const brand = await brandServices.getBrandById(brandId);
        if (brand) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Brand details fetched successfully",
                brand
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Brand is not available."
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


module.exports = getBrandById;