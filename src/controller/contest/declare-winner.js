const contestServices = require("../../db.services.js/contest.service");
const contestPlayerServices = require("../../db.services.js/contestPlayer.service")
const playerServices = require("../../db.services.js/player.service");
const notificationServices = require("../../db.services.js/notification.service");
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
        const { contestId, playerId } = contestDetails;

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