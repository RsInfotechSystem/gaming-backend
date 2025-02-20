const walletServices = require("../../db.services.js/wallet.service");
const playerServices = require("../../db.services.js/player.service");
const notificationServices = require("../../db.services.js/notification.service");
const {requestPaymentValidation} = require("../../utils/validation/contest.validation");
const {sequelize} = require("../../db/db");

const requestPayment = async (request, response) => {
    const transaction = await sequelize.transaction();
    try{
        //extract player id from token
        const { id } = request;

        //extract data from request body
        const {amount, paymentMethod, upiId, bankDetails} = request.body
        
        // validate data 
        const validationResult = await requestPaymentValidation.validate({amount, paymentMethod, upiId, bankDetails}, { abortEarly: true });
        if(validationResult.error){
            return response.status(200).json({
                status : "FAILED",
                message : validationResult?.error?.details[0]?.message,
            });
        };

        //check if payment mothod is UPI or bank transfer then upiId or bankdetails should be provided
        if(paymentMethod === "UPI" && !upiId){
            return response.status(200).json({
                status : "FAILED",
                message : "UPI id is required if payment method is UPI"
            });
        }else if(paymentMethod === "BANK TRANSFER" && !bankDetails){
            return response.status(200).json({
                status : "FAILED",
                message : "Bank details are required if payment method is BANK TRANSFER"
            });
        }

        //chek if player exist or not 
        const isPlayerExist = await playerServices.getPlayerById(id);
        if(!isPlayerExist){
            return response.status(200).json({
                status : "FAILED",
                message : "Player does not exist"
            });
        }

        //check if player has that much amount in his wallet or not
        const playerWallet = await walletServices.getWalletByPlayerId(id);
        if(!playerWallet){
            return response.status(200).json({
                status : "FAILED",
                message : "Player wallet does not exist"
            });
        }

        if(playerWallet.earnedAmount < amount){
            return response.status(200).json({
                status : "FAILED",
                message : "Insufficient balance, please check your wallet"
            });
        }

        //update wallet of player with requested amount
        const updatedAmount = playerWallet.earnedAmount - amount;
        const log = `Player requested for payment on ${new Date().toISOString().split("T")[0].split("").reverse().join("")} of amount ${amount}`;
        const walletData = {
            earnedAmount : updatedAmount,
            paymentLogs : [...(playerWallet.paymentLogs || []), log]
        }
        const walletId = playerWallet.id;
        const updateWallet = await walletServices.updateWallet(walletId,walletData, { transaction });
        if(!updateWallet || updateWallet.modifiedCount === 0){
            await transaction.rollback();
            return response.status(200).json({
                status : "FAILED",
                message : "Failed to deduct amount from players wallet"
            });
        }

        // Send notification to admin that player has requested for payment 
        const notificationForAdmin = {
            title: `Payment Request from ${isPlayerExist.userName}`,
            description: `🔹 **Player Name**: ${isPlayerExist.userName} (ID: ${id})\n
            🔹 **Amount Requested**: ${amount} Coins\n
            🔹 **Payment Method**: ${paymentMethod}\n
            🔹 **UPI ID**: ${upiId ? upiId : "Not Provided"}\n
            🔹 **Bank Details**: ${bankDetails ? "Provided" : "Not Provided"}\n
            📌 **Action Required**: Process the payment as soon as possible.`,
            createdBy: "System",
            notificationFor: "admin",
        };

        const createNotification = await notificationServices.insertNotification([notificationForAdmin], { transaction });
        if(!createNotification){
            await transaction.rollback();
            return response.status(200).json({
                status : "FAILED",
                message : "Failed to send notification to admin, Please try again"
            });
        }
        
        await transaction.commit();

        if (global.adminSocketId) {
            request.io.to(global.adminSocketId).emit("paymentRequest", {
                playerId: id,
                playerName: isPlayerExist.userName,
                amount: amount,
                paymentMethod: paymentMethod,
                upiId: upiId? upiId : "Not Provided",
                bankDetails: bankDetails? bankDetails : "Not Provided",
            });
        }
       
        return response.status(200).json({
            status : "SUCCESS",
            message : "Payment request sent successfylly, your payment will be processed in 24 hours"
        })

    }catch(error) {
        await transaction.rollback();
        return response.status(500).json({
            status : "FAILED",
            message : error.message
        });
    }
}

module.exports = requestPayment; 