const userServices = require("../../db.services.js/user.service");
const { idValidation } = require("../../utils/validation/role.validation");


const changeUserStatus = async (request, response) => {
    try {
        //extract data from request body
        const { userId } = request.body;

        //check validation
        const validationResult = await idValidation.validate({ id: userId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        //check rto exist or not
        const isExist = await userServices.getUserByObjId(userId);
        if (!isExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "The user does not exist."
            })
        };

        const dataToUpdate = {
            isActive: !isExist.isActive
        };

        const status = isExist.isActive === true ? 'disable' : "enable";

        //update data into db and send response to client
        const result = await userServices.updateUserDetails(userId, dataToUpdate);
        if (result[0] > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: `User mark as ${status} successfully`
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: `Failed to mark user as ${status}`
            });
            return;
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    };
};


module.exports = changeUserStatus;