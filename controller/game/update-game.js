const gameServices = require("../../db.services.js/game.service");
const userServices = require("../../db.services.js/user.service");
const { updateGameValidation } = require("../../utils/validation/game.validation");


const updateGame = async (request, response) => {
    try {
        const { id } = request

        //extract data from request body
        const { gameId, name, description, title, contestIds, playedCount } = request.body;

        //check validation
        const validationResult = await updateGameValidation.validate({ gameId, name, description, title, contestIds, playedCount }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //check user exist or not
        const isGameExist = await userServices.getUserByObjId(gameId);
        if (!isGameExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "User does not exist"
            });
        };

        // //check contest exist or not
        // for (let id of contestIds) {
        // const isContestExist = await userServices.getUserByObjId(id);
        // if (!isContestExist) {
        //     return response.status(200).json({
        //         status: "FAILED",
        //         message: "User does not exist"
        //     });
        // };
        // }


        const dataToInsert = {
            name, description, title, addedBy: id, contestIds, playedCount
        }

        //Add role in db and send response to client
        const result = await gameServices.updateGame(dataToInsert);
        console.log("result : ", result);

        if (result) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Game added successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to add game, please try again!",
            });
        }
    } catch (error) {
        console.log("FAILED error : ", error)
        response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
        return;
    }
};

module.exports = updateGame