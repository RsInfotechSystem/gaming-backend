const playerServices = require("../../db.services.js/player.service");
const sendEmail = require("../../utils/helper/sendEmail");
const jwt = require('jsonwebtoken');

const forgetPassword = async (request, response) => {
    try{
        const {userName, email} = request.body;

        if(!userName || !email){
            return response.status(200).json({
                status : "FAILED",
                message : "Please provide username and email",
            });
        }

        // check if player exist with email
        const player = await playerServices.getPlayerByEmail(email);
        if(!player){
            return response.status(200).json({
                status : "FAILED",
                message : "Player not found",
            });
        }

        // check if username and email are of same player
        if(player.userName !== userName){
            return response.status(200).json({
                status : "FAILED",
                message : "Username and email does not match",
            });
        }

        const token = jwt.sign({email}, process.env.JWT_SECRET_KEY, {expiresIn : "1h"});

        // send email to player for changing password

        const dataToSend = {
            name : player.name,
            userName : player.userName,
            resetUrl : `http://localhost:8000/player/change-password?token=${token}`,
        };

        // if(process.env.NODE_ENV === "production"){
        //     dataToSend.resetUrl = "https://gaming-platform/reset-password";
        // }

            // send email to player
            await sendEmail(email, dataToSend);
            return response.status(200).json({
                status : "SUCCESS",
                message : "Email sent successfully",
            });

    }catch(error){
        console.log("Error while getting player list : ",error);
        return response.status(500).json({
            status : "FAILED",
            message : error.message,
        });
    }
}

module.exports = forgetPassword;