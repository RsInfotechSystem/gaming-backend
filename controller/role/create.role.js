const roleServices = require("../../db.services.js/role.service");
const { createRoleValidation } = require("../../utils/validation/role.validation");


const createRole = async (request, response) => {
    try {
        //extract data from request body
        const { name, tab } = request.body;

        //check validation
        const validationResult = await createRoleValidation.validate({ name, tab }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //check role already exist 
        const isRoleExist = await roleServices.getRoleByName(name)
        if (isRoleExist) {
            response.status(200).json({
                status: "FAILED",
                message: "Role already exist with this name",
            });
            return;
        }

        const dataToInsert = {
            name: name?.toLowerCase(),
            tab
        }

        //Add role in db and send response to client
        const result = await roleServices.createRole(dataToInsert);
        if (result) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Role created successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to create role, please try again!",
            });
        }
    } catch (error) {
        response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
        return;
    }
};

module.exports = createRole