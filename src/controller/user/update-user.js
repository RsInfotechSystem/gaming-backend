const locationServices = require("../../db.services.js/location.service");
const roleServices = require("../../db.services.js/role.service");
const userServices = require("../../db.services.js/user.service");
const { updateUserValidation } = require("../../utils/validation/user.validation");


const updateUser = async (request, response) => {
    try {
        //extract data from request body
        const { userId, name, email, mobile, password, roleId } = request.body;

        //check validation
        const validationResult = await updateUserValidation.validate({ userId, name, email, mobile, password, roleId}, { abortEarly: true });
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

        //ensure user should not be similar to the existing one
        const existingUser = await userServices.getExistingUserByMobileNo(userId, mobile?.toString());
        if (existingUser) {
            response.status(200).json({
                status: "FAILED",
                message: `User already exist with same mobile no.`
            });
            return;
        }


        //check user active or not
        if (isExist?.isActive === false) {
            return response.status(200).json({
                status: "FAILED",
                message: "You can not update disable user."
            });
        }

        //check role exist or not
        const isRoleExist = await roleServices.getRoleById(roleId);
        if (!isRoleExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Role does not exist"
            })
        };

        // //check location exist or not
        // const isLocationExist = await locationServices.getLocationById(locationId);
        // if (!isLocationExist) {
        //     return response.status(200).json({
        //         status: "FAILED",
        //         message: "Location does not exist"
        //     })
        // };


        const dataToUpdate = {
            name: name?.toLowerCase(),
            email,
            mobile: mobile?.toString(),
            password,
            roleId,
            roleName: isRoleExist?.name,
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