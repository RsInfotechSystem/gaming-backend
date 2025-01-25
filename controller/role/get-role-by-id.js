const roleServices = require("../../db.services.js/role.service");
const { idValidation } = require("../../utils/validation/role.validation");



const getRoleById = async (request, response) => {
    try {
        //extract roleId from request body
        const roleId = request.body.roleId;

        //check validation
        const validationResult = await idValidation.validate({ id: roleId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        };

        //check role exist or not
        const role = await roleServices.getRoleById(roleId);
        if (role) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Role details fetched successfully",
                role
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Role is not available."
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


module.exports = getRoleById;