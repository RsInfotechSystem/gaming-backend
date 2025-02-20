const playerServices = require("../../db.services.js/player.service");
const sendEmail = require("../../utils/helper/sendEmail");
const jwt = require('jsonwebtoken');

const forgetPassword = async (request, response) => {
    try {
        const { userName, email } = request.body;

        if (!userName || !email) {
            return response.status(200).json({
                status: "FAILED",
                message: "Please provide username and email",
            });
        }

        // check if player exist with email
        const isPlayerExist = await playerServices.getPlayerByEmail(email);
        if (!isPlayerExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Player not found",
            });
        }

        // check if username and email are of same player
        if (isPlayerExist?.userName !== userName) {
            return response.status(200).json({
                status: "FAILED",
                message: "Username and email does not match",
            });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        console.log("token : ", token)

        const frontendUrl = process.env.BACKEND_URL.includes("localhost")
        ? "http://localhost:3000"  
        : "https://gaming.rsinfotechsys.com"

        const dataToSend = {
            name: isPlayerExist?.name,
            userName: isPlayerExist?.userName,
            resetUrl: `${frontendUrl}/player/change-password-form?token=${token}`,
        };


        // send email to player for changing password

        // if(process.env.NODE_ENV === "production"){
        //     dataToSend.resetUrl = "https://gaming-platform/reset-password";
        // }

        console.log("dataToSend : ", dataToSend);

        // send email to player
        await sendEmail(email, dataToSend);
        return response.status(200).json({
            status: "SUCCESS",
            message: "Email sent successfully",
        });

    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

module.exports = forgetPassword;