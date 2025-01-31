const userServices = require("../../db.services.js/user.service");
const jwt = require('jsonwebtoken');
const sendEmail = require("../../utils/helper/sendEmail");

const forgetPassword = async (request, response) => {
    try{
        const {userId,email} = request.body;

        if(!userId||!email){
            return response.status(200).json({
                status : "FAILED",
                message : "Please provide userId and email",
            });
        }

        // check if user exist with email
        const isUserExist = await userServices.getUserByEmail(email);
        if(!isUserExist){
            return response.status(200).json({
                status : "FAILED",
                message : "User not found",
            });
        }

        const token = jwt.sign({email}, process.env.JWT_SECRET_KEY, {expiresIn : "1h"});
         if(!token){
        return response.status(200).json({
            status : "FAILED",
            message : "Unable to generate token, please try again",
        });
        }        

        const dataToSend = {
            name : isUserExist.name,
            userName : isUserExist.userId,
            resetUrl : `http://localhost:8000/user/change-password`,
        };

        
        // send email to player for changing password

          // if(process.env.NODE_ENV === "production"){
        //     dataToSend.resetUrl = "https://gaming-platform/reset-password";
        // }

        // send email to user for changing password
        await sendEmail(isUserExist.email, dataToSend);
        return response.status(200).json({
            status : "SUCCESS",
            message : "Email sent successfully",
        });

    }catch(error){
        console.log("Error while getting user list : ",error);
        return response.status(500).json({
            status : "FAILED",
            message : error.message,
        });
    }
}