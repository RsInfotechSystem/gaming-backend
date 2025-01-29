const userServices = require("../../db.services.js/user.service");
const { idValidation } = require("../../utils/validation/role.validation");


const getUserById = async (request, response) => {
    try {
        //extract data from request body
        const userId = request.body.userId;

        //check validation
        const validationResult = await idValidation.validate({ id: userId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        };

        //check user exist or not
        const user = await userServices.getUserByObjId(userId);
        if (user) {
            response.status(200).json({
                status: "SUCCESS",
                message: "User details fetched successfully",
                user
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "User does not exist."
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


module.exports = getUserById;