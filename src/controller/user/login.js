const userServices = require("../../db.services.js/user.service");
const { loginValidationSchema } = require("../../utils/validation/user.validation");
const generateUserJWT = require("../../utils/middleware/generate-token")

const login = async (request, response) => {
    try {
        //extract data from request body
        const { email, password } = request.body;

        //check validation
        const validationResult = await loginValidationSchema.validate({ email, password }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        };

        //check user exist or not
        const isUserExist = await userServices.getUserByEmail(email);
        if (!isUserExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Invalid email, check your email & try again!"
            })
        };


        //Check User active or not
        if (isUserExist.isActive === false) {
            return response.status(200).json({
                status: "FAILED",
                message: "You don't have access to login, Please contact Admin"
            })
        }

        //Check password same or not
        if (isUserExist.password === password) {
            const token = generateUserJWT(isUserExist.userId, isUserExist.name, isUserExist?.email, isUserExist?.mobile, isUserExist?.role?.name)
            if (token) {
                return response.status(200).json({
                    status: "SUCCESS",
                    message: "Login Successfully",
                    token,
                    userDetails: isUserExist
                })
            }
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Incorrect password, please check your password and try again!",
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


module.exports = login;