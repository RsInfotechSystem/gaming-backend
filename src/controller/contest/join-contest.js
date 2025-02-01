const contestServices = require("../../db.services.js/contest.service");
const gameServices = require("../../db.services.js/game.service");
const playerServices = require("../../db.services.js/player.service");
const { joinContestValidation } = require("../../utils/validation/contest.validation");


const joinContest = async (request, response) => {
    try {
        const { id } = request
        console.log(" id : ", id)

        //extract data from request body
        const { contestId, gameUserName } = request.body;

        //check validation
        const validationResult = await joinContestValidation.validate({ contestId, gameUserName }, { abortEarly: true });
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
        const isPlayerExist = await playerServices.getPlayerById(id);
        if (!isPlayerExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Player does not exist",
            });
        }

        if (isContestExist?.dataValues?.reqCoinsToJoin > isPlayerExist?.dataValues?.availableCoins) {
            return response.status(200).json({
                status: "FAILED",
                message: "You have insufficient coins to join the contest, Kindly purchase",
            });
        }

        let allPlayers = [...isContestExist?.dataValues?.joinedPlayers, id]

        if (isContestExist?.dataValues?.playersLimit < allPlayers?.length) {
            return response.status(200).json({
                status: "FAILED",
                message: "Room is full!",
            });
        }

        const dataToUpdate = {
            contestId, gameUserName, joinedPlayers: allPlayers
        }

        //Add contest in db and send response to client
        const result = await contestServices.updateContest(contestId, dataToUpdate);

        if (result) {
            let availableCoins = isPlayerExist?.dataValues?.availableCoins - isContestExist?.dataValues?.reqCoinsToJoin
            const updatedPlayer = await playerServices.updatePlayer(id, { availableCoins: availableCoins });

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
        console.log("error : ", error)
        response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
        return;
    }
};

module.exports = joinContest