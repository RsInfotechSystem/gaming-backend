const locationServices = require("../../db.services.js/location.service");
const roleServices = require("../../db.services.js/role.service");
const userServices = require("../../db.services.js/user.service");
const { updateUserValidation } = require("../../utils/validation/user.validation");


const updateUser = async (request, response) => {
    try {
        //extract data from request body
        const { userId, name, email, mobile, roleId } = request.body;

        //check validation
        const validationResult = await updateUserValidation.validate({ userId, name, email, mobile, roleId}, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        //check user exist or not
        const isExist = await userServices.getUserByObjId(userId);
        if (!isExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "User does not exist"
            });
        };


        //check user active or not
        if (isExist?.isActive === false) {
            return response.status(200).json({
                status: "FAILED",
                message: "You can not update disable user."
            });
        }

        //check role exist or not
        if(roleId){
            const isRoleExist = await roleServices.getRoleById(roleId);
            if (!isRoleExist) {
                return response.status(200).json({
                    status: "FAILED",
                    message: "Role does not exist"
                })
            };

        }
        
        const dataToUpdate = {
            name: name?.toLowerCase() ? name : isExist.name,
            email : email ? email : isExist.email ,
            mobile: mobile?.toString() ? mobile : isExist.mobile,
            roleId : roleId ? roleId: isExist.roleId,
        };

        //update data into db and send response to client
        const result = await userServices.updateUserDetails(userId, dataToUpdate);
        if (result[0] > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "User details updated successfully"
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


module.exports = updateUser;