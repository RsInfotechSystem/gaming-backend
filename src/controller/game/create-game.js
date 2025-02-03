const gameServices = require("../../db.services.js/game.service");
const userServices = require("../../db.services.js/user.service");
const runMiddleware = require("../../utils/helper/multer.middleware");
const { createGameValidation } = require("../../utils/validation/game.validation");
const { uploadImg } = require('../../utils/multer/upload.img');


const createGame = async (request, response) => {
    try {
        const { id } = request

        //Upload image file using multer
        const file = await runMiddleware(request, response, uploadImg.array("gamefiles", 10));
        if (file) {
            response.status(200).json({
                status: "FAILED",
                message: file?.code,
            });
            return;
        };

        const gameDetails = JSON.parse(request.body.gameDetails);

        //extract data from request body
        const { name, description, title, contestIds, playedCount } = gameDetails;

        //check validation
        const validationResult = await createGameValidation.validate({ name, description, title, contestIds, playedCount }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //check user exist or not
        // const isUserExist = await userServices.getUserByObjId(userId);
        // if (!isUserExist) {
        //     return response.status(200).json({
        //         status: "FAILED",
        //         message: "User does not exist"
        //     });
        // };

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

        const attachment = request.files?.map((file) => {
            const splitUrlArray = file?.destination?.split("/");
            const filteredUrl = splitUrlArray[splitUrlArray.length - 3] + '/' + splitUrlArray[splitUrlArray.length - 2] + '/' + splitUrlArray[splitUrlArray.length - 1] + file.filename;
            return {
                documentName: file.originalname,
                fileUrl: filteredUrl,
            }
        }) ?? [];

        const dataToInsert = {
            name, description, title, addedBy: id, contestIds, playedCount,
            gamefiles: attachment ?? [],
        }

        //Add role in db and send response to client
        const result = await gameServices.createGame(dataToInsert);

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
        response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
        return;
    }
};

module.exports = createGame