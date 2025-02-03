// const locationServices = require("../../db.services.js/location.service");
const roleServices = require("../../db.services.js/role.service");
const userServices = require("../../db.services.js/user.service");
const { createUserValidationSchema } = require("../../utils/validation/user.validation");
const bcrypt = require("bcrypt");


const createUser = async (request, response) => {
    try {
        //extract data from request body
        const { name, email, mobile, password, roleId} = request.body;

        if (!name || !email || !mobile || !password || !roleId) {
            return response.status(200).json({
                status: "FAILED",
                message: "All fields are required"
            });
        }

        //check validation
        const validationResult = await createUserValidationSchema.validate({ name, email, mobile: mobile?.toString(), password, roleId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        };

        //check user already exist with mobile no
        const isUserExist = await userServices.getUserByMobile(String(mobile))
        if (isUserExist) {
            response.status(200).json({
                status: "FAILED",
                message: "User already exist with this mobile",
            });
            return;
        };

        //check role exist or not
        const isRoleExist = await roleServices.getRoleById(roleId);
        if (!isRoleExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Role does not exist"
            })
        };

        //check location exist or not
        // const isLocationExist = await locationServices.getLocationB;
        // if (!isLocationExist) {
        //     return response.status(200).json({
        //         status: "FAILED",
        //         message: "Location does not exist"
        //     })
        // };


        let userId;
        //get all users for userId
        const users = await userServices.getLatestCreatedRecord();
        //generate user id
        if (users) {
            const lastUserUserId = Number(users.userId.substring(3)) + 1;
            userId = `GAM${lastUserUserId}`
        } else {
            userId = "GAM1000"
        };

        //hash password
        const hashPassword = await bcrypt.hash(password, 12);

        const dataToInsert = {
            name: name?.toLowerCase(),
            email,
            mobile: mobile?.toString(),
            password : hashPassword,
            roleId,
            roleName: isRoleExist?.name,
            userId,
            isActive: true,
            isDeleted: false
        }

        //insert data into db & send response to client
        const result = await userServices.createUser(dataToInsert);
        if (result && result.dataValues && result.dataValues.id) {
            response.status(200).json({
                status: "SUCCESS",
                message: "User created successfully",
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Failed to create user, Please try again!",
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


module.exports = createUser