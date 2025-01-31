const userServices = require("../../db.services.js/user.service");
const {resetPasswordValidationSchema} = require("../../utils/validation/user.validation");
const bcrypt = require("bcrypt");

const resetPassword = async (request, response) =>{
    try{
        const { userId, oldPassword, newPassword } = request.body;
        
        if(!userId || !oldPassword || !newPassword){
            return response.status(200).json({
                status: "FAILED",
                message: "User Id, old password, and new password are required."
            });
        }

        const validationResult = await resetPasswordValidationSchema.validate({ userId }, { abortEarly: true });
        if(validationResult.error){
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
        }

        const isUserExist = await userServices.getUserByObjId(userId);
        if(!isUserExist){
            return response.status(200).json({
                status: "FAILED",
                message: "User does not exist."
            });
        }

        if(isUserExist?.isActive === false){
            return response.status(200).json({
                status: "FAILED",
                message: "You cannot update a disabled user."
            });
        }

        const matchPassword = await bcrypt.compare(oldPassword, isUserExist.password);
        if(!matchPassword){
            return response.status(200).json({
                status: "FAILED",
                message: "Enter Correct Old Password."
            });
        }   

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const dataToUpdate = {
            password: hashedPassword
        };

        const updatedUser = await userServices.updateUserDetails(userId, dataToUpdate);
        if(updatedUser && updatedUser[0] > 0){
            return response.status(200).json({
                status: "SUCCESS",
                message: "Password updated successfully."
            });
        }else{
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to update password."
            });
        }
    }catch(error){
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
}

module.exports = resetPassword;