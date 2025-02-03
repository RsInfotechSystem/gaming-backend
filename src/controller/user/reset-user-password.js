const userServices = require("../../db.services.js/user.service");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resetUserPassword = async (request, response) => {
    try {
        const { token, newPassword, confirmNewPassword } = request.body;

        if (!token || !newPassword || !confirmNewPassword) {
            return response.status(200).json({
                status: "FAILED",
                message: "Please provide userId, new password and confirm new password",
            });
        }

        const email = jwt.verify(token, process.env.JWT_SECRET_KEY).email;


        // check if new password and confirm new password are same
        if (newPassword !== confirmNewPassword) {
            return response.status(200).json({
                status: "FAILED",
                message: "New password and confirm new password does not match",
            });
        }

        // check if user exist with email
        const isUserExistser = await userServices.getUserByEmail(email);
        if (!isUserExistser) {
            return response.status(200).json({
                status: "FAILED",
                message: "User not found",
            });
        }


        const hashPassword = await bcrypt.hash(newPassword, 12);

        let password = hashPassword;

        // update password
        const updatedPassword = await userServices.updateUserPassword(isUserExistser.userId, password);
        if (!updatedPassword) {
            return response.status(200).json({
                status: "FAILED",
                message: "Unable to update password, please try again",
            });
        } else {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Password updated successfully",
            });
        }

    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
}

module.exports = resetUserPassword;