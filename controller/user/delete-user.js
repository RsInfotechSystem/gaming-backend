const userServices = require("../../db.services.js/user.service");
const { userIdsValidationSchema } = require("../../utils/validation/user.validation");


const deleteSelectedUser = async (request, response) => {
    try {
        //extract data from request body
        const userIds = request.body.userIds;

        //check validation
        const validationResult = await userIdsValidationSchema.validate({ userIds }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        const arrayLength = userIds?.length;
        for (let i = 0; i < arrayLength; i++) {
            const user = userIds[i];
            const isUserExist = await userServices.getUserByObjId(user);
            if (!isUserExist) {
                return response.status(200).json({
                    status: 'FAILED',
                    message: "User does not exist."
                });
            };

            //check user is in used or not
            // const isUserIsInUsed = await inventoryServices.getUserWiseStock(user)
            // if (isUserIsInUsed?.length > 0) {
            //     return response.status(200).json({
            //         status: "FAILED",
            //         message: `User ${isUserExist?.name} has been assigned some inventory tasks, so it cannot be deleted.`
            //     })
            // }
        };

        //delete the selected user from db and send response to client
        let result = await userServices.deleteSelectedUsers(userIds);
        if (result > 0) {
            return response.status(200).json({
                status: 'SUCCESS',
                message: 'User deleted successfully.'
            });
        } else {
            return response.status(200).json({
                status: 'FAILED',
                message: 'Failed to delete user.'
            });
        };
    } catch (error) {
        return response.status(500).json({
            status: 'FAILED',
            message: error.message
        });
    }
};


module.exports = deleteSelectedUser;