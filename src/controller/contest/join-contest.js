const contestServices = require("../../db.services.js/contest.service");
const gameServices = require("../../db.services.js/game.service");
const playerServices = require("../../db.services.js/player.service");
const notificationServices = require("../../db.services.js/notification.service");
const {
  joinContestValidation,
} = require("../../utils/validation/contest.validation");

const joinContest = async (request, response) => {
  try {
    const { id } = request;

    //extract data from request body
    const { contestId, gameUserName } = request.body;

    //check validation
    const validationResult = await joinContestValidation.validate(
      { contestId, gameUserName },
      { abortEarly: true }
    );
    if (validationResult.error) {
      return response.status(200).json({
        status: "FAILED",
        message: validationResult?.error?.details[0]?.message,
      });
    }

    //check contest already exist
    const isContestExist = await contestServices.getContestById(contestId);
    if (!isContestExist) {
      return response.status(200).json({
        status: "FAILED",
        message: "Contest does not exist",
      });
    }

    //check player already exist Id or not
    const isPlayerExist = await playerServices.getPlayerById(id);
    if (!isPlayerExist) {
      return response.status(200).json({
        status: "FAILED",
        message: "Player does not exist",
      });
    }

    if (
      isContestExist?.dataValues?.reqCoinsToJoin >
      isPlayerExist?.dataValues?.availableCoins
    ) {
      return response.status(200).json({
        status: "FAILED",
        message:
          "You have insufficient coins to join the contest, Kindly purchase",
      });
    }

    if (isContestExist?.dataValues?.joinedPlayers.includes(id)) {
      return response.status(200).json({
        status: "FAILED",
        message: "You have already joined this contest",
      });
    }

    // if (isContestExist?.dataValues?.joinedPlayers.includes(id))
    let allPlayers = [...isContestExist?.dataValues?.joinedPlayers, id];

    if (isContestExist?.dataValues?.playersLimit < allPlayers?.length) {
      return response.status(200).json({
        status: "FAILED",
        message: "Room is full!",
      });
    }

    const dataToUpdate = {
      contestId,
      gameUserName,
      joinedPlayers: allPlayers,
    };

    //Add contest in db and send response to client
    const result = await contestServices.updateContest(contestId, dataToUpdate);

    if (result) {
      let availableCoins =
        isPlayerExist?.dataValues?.availableCoins -
        isContestExist?.dataValues?.reqCoinsToJoin;

      const updatedPlayer = await playerServices.updatePlayer(id, {
        availableCoins: availableCoins,
        joinedContests: [
          ...isPlayerExist?.dataValues?.joinedContests,
          contestId,
        ],
      });

      const notifications = {
        title: `${isPlayerExist.userName} has joined the battle in ${isContestExist.name} contest`,
        description: `🎮 **New Challenger Has Entered the Arena!** 🚀  
        🔥 **${isPlayerExist.userName}** has just joined the **"${isContestExist.name}"** contest!  

        🔹 **Match Details:**  
        📆 **Date:** ${isContestExist.contestDate} ⏰ **Time:** ${isContestExist.contestTime}  
        🎮 **Game:** ${isContestExist.gameType} *(Game ID: ${isContestExist.gameId})*  
        🏆 **Prize Pool:** ${isContestExist.winningPrice} Coins  
        🔑 **Battle Zone (Room ID):** ${isContestExist.roomId}  

        ⚔️ **Player Status:**  
        🆕 **New Challenger:** ${isPlayerExist.name} *(Username: ${isPlayerExist.userName}, ID: ${isPlayerExist.id})*  
        💰 **Entry Fee Paid:** ${isContestExist.reqCoinsToJoin} Coins  
        💳 **Coins Left in Wallet:** ${availableCoins}  

        👥 **Current Warriors in the Battle:** ${allPlayers.length} / ${isContestExist.playersLimit}  

        🎯 The competition is heating up! Keep an eye on the contest as more players join. Make sure everything is set for a smooth and fair game!`,
        createdBy: id,
        notificationFor: "admin",
      };

      console.log("notification :",notifications);
      
      const sendNotification = await notificationServices.insertNotification(notifications)
      if(!sendNotification){
        return response.status(200).json({
            status : "FAILED",
            message : "Failed to send notificatoin, Please try again"
        });
      }

      return response.status(200).json({
        status: "SUCCESS",
        message: "Contest joined successfully",
      });
    } else {
      return response.status(200).json({
        status: "FAILED",
        message: "Failed to join contest, please try again!",
      });
    }
  } catch (error) {
    response.status(500).json({
      status: "FAILED",
      message: error.message,
    });
    return;
  }
};

module.exports = joinContest;
