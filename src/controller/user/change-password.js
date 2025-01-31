const userServices = require("../../db.services.js/user.service");
const  bcrypt = require('bcrypt');

const changePassword = async (request, response) =>{
    try{
        const {email, newPassword, confirmNewPassword} = request.body;

        if(!email || !newPassword || !confirmNewPassword){
            return response.status(200).json({
                status : "FAILED",
                message : "Please provide userId, new password and confirm new password",
            });
        }

        // check if user exist with userId
        const isUserExistser = await userServices.getUserByEmail(email);
        if(!isUserExistser){
            return response.status(200).json({
                status : "FAILED",
                message : "User not found",
            });
        }

        // check if new password and confirm new password are same
        if(newPassword !== confirmNewPassword){
            return response.status(200).json({
                status : "FAILED",
                message : "New password and confirm new password does not match",
            });
        }

        const hashPassword = await bcrypt.hash(newPassword, 12);

        const dataToUpdate ={
            password : hashPassword,
        }

        const updatedPassword = await userServices.updateUserDetails({userId:isUserExistser.userId}, dataToUpdate);
        if(!updatedPassword){
            return response.status(200).json({
                status : "FAILED",
                message : "Unable to update password, please try again",
            });
        }else{
            return response.status(200).json({
                status : "SUCCESS",
                message : "Password updated successfully",
            });
        }

    }catch(error){
        console.log("Error while changing password : ",error);
        return response.status(500).json({
            status : "FAILED",
            message : error.message,
        });
    }
}

module.exports = changePassword;