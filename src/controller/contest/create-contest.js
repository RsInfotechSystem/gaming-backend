const contestServices = require("../../db.services.js/contest.service");
const gameServices = require("../../db.services.js/game.service");
const runMiddleware = require("../../utils/helper/multer.middleware");
const { uploadImg } = require("../../utils/multer/upload.img");
const { createContestValidation } = require("../../utils/validation/contest.validation");


const createContest = async (request, response) => {
    try {
        const { id } = request
        console.log(" id : ", id)
        //Upload image file using multer
        const file = await runMiddleware(request, response, uploadImg.array("contestFiles", 10));
        if (file) {
            response.status(200).json({
                status: "FAILED",
                message: file?.code,
            });
            return;
        };

        const contestDetails = JSON.parse(request.body.contestDetails);
        //extract data from request body
        const { name, description, gameId, gameType, contestDate, contestTime, reqCoinsToJoin, winningPrice, playersLimit, roomId, passwordToJoin } = contestDetails;

        //check validation
        const validationResult = await createContestValidation.validate({ name, description, gameId, gameType, contestDate, contestTime, reqCoinsToJoin, winningPrice, playersLimit, roomId, passwordToJoin }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //check contest already exist 
        // const isContestExist = await contestServices.getContestByName(name)
        // if (isContestExist) {
        //     response.status(200).json({
        //         status: "FAILED",
        //         message: "Contest already exist with this name",
        //     });
        //     return;
        // }

        const isGameExist = await gameServices.getGameById(gameId);
        if (!isGameExist) {
            response.status(200).json({
                status: "FAILED",
                message: "Contest already exist with this name",
            });
            return;
        }

        // Allowed game types
        const allowedGameTypes = ["solo", "duo", "squad"];
        if (!allowedGameTypes.includes(gameType)) {
            return response.status(400).json({
                status: "FAILED",
                message: "Invalid game type. Allowed values: solo, duo, squad",
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


        const dataToInsert = {
            name, description, gameId, gameType, contestDate,
            contestTime, reqCoinsToJoin, winningPrice, playersLimit, roomId, passwordToJoin,
            createdBy: id,
            contestFiles: attachment ?? []
        }

        //Add contest in db and send response to client
        const result = await contestServices.createContest(dataToInsert);

        if (result) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Contest created successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to create contest, please try again!",
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

module.exports = createContest