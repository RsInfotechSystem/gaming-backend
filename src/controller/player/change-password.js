const playerServices = require("../../db.services.js/player.service");

const changePassword = async (request, response) => {
    try{
        const {token} = request.query; 
        const {newPassword, confirmNewPassword} = request.body;

        if(!token){
            return response.status(200).json({
                status : "FAILED",
                message : "Token not found",
            });
        }

        if( !newPassword || !confirmNewPassword){
            return response.status(200).json({
                status : "FAILED",
                message : "Please provide new password and confirm New Password",
            });
        }
        const email = jwt.verify(token, process.env.JWT_SECRET_KEY).email;

        // check if player exist with email 
        const player = await playerServices.getPlayerByEmail(email);
        if(!player){
            return response.status(200).json({
                status : "FAILED",
                message : "Player not found",
            });
        }

        // check if new password and confirm new password are same
        if(newPassword !== confirmNewPassword){
            return response.status(200).json({
                status : "FAILED",
                message : "New password and confirm new password does not match",
            });
        }

        const updatePassword = await playerServices.updatePlayerPassword(email, newPassword);
        if(!updatePassword){
            return response.status(200).json({
                status : "FAILED",
                message : "unable to updated password",
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