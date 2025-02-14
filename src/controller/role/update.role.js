const roleServices = require("../../db.services.js/role.service");
const { updateRoleValidation } = require("../../utils/validation/role.validation");


const updateRole = async (request, response) => {
    try {
        //extract data from request body
        const { roleId, name, tab } = request.body;

        //check validation
        const validationResult = await updateRoleValidation.validate({ roleId, name, tab }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        //check role exist or not
        const isExist = await roleServices.getRoleById(roleId);
        if (!isExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Role does not exist"
            });
        };

        //ensure role should not be similar to the existing one
        // const existingRole = await roleServices.getExistingRoleByName(roleId, name?.toLowerCase());
        // if (existingRole) {
        //     response.status(200).json({
        //         status: "FAILED",
        //         message: `${existingRole?.role} role is already exist.`
        //     });
        //     return;
        // };

        const dataToUpdate = {
            name: name?.toLowerCase() ? name : isExist.name ,
            tab : tab ? tab : isExist.tab
        };

        //update data into db and send response to client
        const result = await roleServices.updateRoleDetails(roleId, dataToUpdate);
        if (result[0] > 0) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Role details updated successfully"
            })
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


module.exports = updateRole;