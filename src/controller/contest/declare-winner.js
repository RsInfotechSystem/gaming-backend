const contestServices = require("../../db.services.js/contest.service");
const contestPlayerServices = require("../../db.services.js/contestPlayer.service")
const playerServices = require("../../db.services.js/player.service");
const notificationServices = require("../../db.services.js/notification.service");
const walletServices = require("../../db.services.js/wallet.service");
const runMiddleware = require("../../utils/helper/multer.middleware");
const { uploadImg } = require("../../utils/multer/upload.img");
const { declareWinnerValidation } = require("../../utils/validation/contest.validation");


const declareWinner = async (request, response) => {
    try {
        //Upload image file using multer
        const file = await runMiddleware(request, response, uploadImg.array("winningFiles", 10));
        if (file) {
            response.status(200).json({
                status: "FAILED",
                message: file?.code,
            });
            return;
        };

        const contestDetails = JSON.parse(request.body.contestDetails);
        //extract data from request body
        const { contestId, playerId} = contestDetails;

        //check validation
        const validationResult = await declareWinnerValidation.validate({ contestId, playerId }, { abortEarly: true });
        if (validationResult.error) {
            return response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
        };

        //check contest already exist 
        const isContestExist = await contestServices.getContestById(contestId)

        if (!isContestExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Contest does not exist",
            });
            ;
        }

        // let validWinners = [];
        // let invalidPlayers = [];

        //check player already exist Id or not
        const isPlayerExist = await playerServices.getPlayerById(playerId);
        if (!isPlayerExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Player does not exist",
            });
        }


        // console.log("isContestExist?.dataValues?.joinedPlayers.includes(playerId) : ", isContestExist?.dataValues?.joinedPlayers.includes(playerId));

        const isPlayerJoined = await contestPlayerServices.getContestByPlayerIdAndContestId(playerId, contestId);

            if (!isPlayerJoined) {
                return response.status(200).json({
                    status: "FAILED",
                    message: "The selected player has not joined this contest.",
                });
            }


        // for (const playerId of playerIds) {
        //     // Check if player exists
        //     const player = await playerServices.getPlayerById(playerId);
        //     if (!player) {
        //         invalidPlayers.push(playerId);
        //         continue;
        //     }

        //     // Check if player joined contest
        //     const isPlayerJoined = await contestPlayerServices.getContestByPlayerIdAndContestId(playerId, contestId);
        //     if (!isPlayerJoined) {
        //         invalidPlayers.push(playerId);
        //         continue;
        //     }

        //     validWinners.push(player);
        // }

        // if(validWinners.length === 0){
        //     return responmse.status(200).json({
        //         status : "FAILED",
        //         message : "No valid player found to declare winner"
        //     });
        // }

        
        const attachment = request.files?.map((file) => {
            const splitUrlArray = file?.destination?.split("/");
            const filteredUrl = splitUrlArray[splitUrlArray.length - 3] + '/' + splitUrlArray[splitUrlArray.length - 2] + '/' + splitUrlArray[splitUrlArray.length - 1] + file.filename;
            return {
                documentName: file.originalname,
                fileUrl: filteredUrl,
            }
        }) ?? [];


        const dataToUpdate = {
            winner: playerId,
            winningFiles: attachment ?? []
        }

        //Add contest in db and send response to client
        const result = await contestServices.updateContest(contestId, dataToUpdate);

        if (result) {
            //update wallet of player with winning amount 
            const isWalletExist = await walletServices.getWalletByPlayerId(playerId);
            if(!isWalletExist){
                return response.status(200).json({
                    status : "FAILED",
                    message : "Player wallet does not exist"
                });
            }
            const log = `Amount credited to wallet on ${new Date().toISOString().split("T")[0].split("").reverse().join("")} for winning contest ${isContestExist.name}, with contest Id : ${contestId} of amount ${isContestExist.winningPrice}`;
            
            const updatedAmount = Number((Number(isWalletExist.earnedAmount) + Number(isContestExist.winningPrice)).toFixed(2));
            console.log("updatedAmount : ", updatedAmount);
            
            const walletData = {
                earnedAmount : updatedAmount,
                paymentLogs : [...(isWalletExist.paymentLogs || []), log]
            }
            const walletId = isWalletExist.id;
            const updateWallet = await walletServices.updateWallet(walletId, walletData);
            if(!updateWallet || updateWallet.modifiedCount === 0){
                return response.status(200).json({
                    status : "FAILED",
                    message : "Failed to add winning amount in player wallet"
                });
            }

            const notificationForAdmin = {
                title: `Winner Declared for ${isContestExist.name} contest`,
                description: `🎯 **${isPlayerExist.userName}** (ID: ${playerId}) has been declared the **winner** of **"${isContestExist.name}"**!\n
                🔹 **Game Type**: ${isContestExist.gameType} (Game ID: ${isContestExist.gameId})
                🔹 **Game Date & Timing** : Date : ${isContestExist.contestDate}    Time : ${isContestExist.contestTime}
                🔹 **Winning Proof Attached**: ${attachment.length > 0 ? "✅ Yes" : "❌ No"}`,
                createdBy: "Admin",
                notificationFor: "admin",
            }

            const notificationForPlayer = {
                title: `🏆 Congratulations! You won the ${isContestExist.name} contest!`,
                description: `🎉 Player **${isPlayerExist.userName}** has been declared the winner of **"${isContestExist.name}"**!\n
                🏅 Game: ${isContestExist.gameType} (Game ID: ${isContestExist.gameId})
                🎯 Prize Pool: ${isContestExist.winningPrice} Coins
                📁 Proof Attached: ${attachment.length > 0 ? "✅ Yes" : "❌ No"}`,
                createdBy: "Admin",
                notificationFor: playerId,
            }

            const createNotification = await notificationServices.insertNotification([notificationForAdmin, notificationForPlayer]);

            if (!createNotification) {
                return response.status(200).json({
                    status: "FAILED",
                    message: "Failed to send notificatoin, Please try again"
                })
            }

            request.io.emit("winnerDeclared", {
                contestId,
                winnerId: playerId,
                winnerName: isPlayerExist.userName,
                winningFiles: attachment,
            });

            if (global.adminSocketId) {
                request.io.to(global.adminSocketId).emit("newWinnerDeclared", {
                    contestId,
                    winnerId: playerId,
                    winnerName: isPlayerExist.userName,
                });
            }

            request.io.to(`user_${playerId}`).emit("youWon", {
                contestId,
                winnerName: isPlayerExist.userName,
                prize: isContestExist.winningPrice,
            });

            return response.status(200).json({
                status: "SUCCESS",
                message: "Winner declared successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to declare winner, please try again!",
            });
        }

    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
    }
};

module.exports = declareWinner;