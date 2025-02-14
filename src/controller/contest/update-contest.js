const contestServices = require("../../db.services.js/contest.service");
const gameServices = require("../../db.services.js/game.service");
const runMiddleware = require("../../utils/helper/multer.middleware");
const { uploadImg } = require("../../utils/multer/upload.img");
const { updateContestValidation } = require("../../utils/validation/contest.validation");


const updateContest = async (request, response) => {
    try {
        const { id } = request

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
        const { contestId, name, description, gameType, contestDate, contestTime, reqCoinsToJoin, winningPrice, playersLimit, roomId, passwordToJoin, oldContestFiles } = contestDetails;

        //check validation
        const validationResult = await updateContestValidation.validate({ contestId, name, description, gameType, contestDate, contestTime, reqCoinsToJoin, winningPrice, playersLimit, roomId, passwordToJoin, oldContestFiles }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        const isContestExist = await contestServices.getContestById(contestId)
        if (!isContestExist) {
            response.status(200).json({
                status: "FAILED",
                message: "Contest does not exist",
            });
            return;
        }

        //check contest already exist 
        // const isContestExistWithSameName = await contestServices.getContestByName(name)
        // if (isContestExistWithSameName) {
        //     response.status(200).json({
        //         status: "FAILED",
        //         message: "Contest already exist with this name",
        //     });
        //     return;
        // }

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
            name : name ? name: isContestExist.name, 
            description : description ? description : isContestExist.description, 
            gameType : gameType ? gameType : isContestExist.gameType, 
            contestDate : contestDate ? contestDate : isContestExist.contestDate,
            contestTime : contestTime ? contestTime : isContestExist.contestTime, 
            reqCoinsToJoin : reqCoinsToJoin ? reqCoinsToJoin : isContestExist.reqCoinsToJoin, 
            winningPrice : winningPrice ? winningPrice : isContestExist.winningPrice, 
            playersLimit : playersLimit ? playersLimit : isContestExist.playersLimit, 
            roomId : roomId ? roomId : isContestExist.roomId, 
            passwordToJoin : passwordToJoin ? passwordToJoin : isContestExist.passwordToJoin,
            createdBy: request.id,
            contestFiles: [...attachment, ...oldContestFiles] ?? [],
        }

        //Add contest in db and send response to client
        const result = await contestServices.updateContest(contestId, dataToInsert);

        if (result) {

            request.io.emit("contestUpdated",{
                id: contestId,
                name: dataToInsert.name,
                description: dataToInsert.description,
                gameType: dataToInsert.gameType,
                contestDate: dataToInsert.contestDate,
                contestTime: dataToInsert.contestTime,
                reqCoinsToJoin: dataToInsert.reqCoinsToJoin,
                winningPrice: dataToInsert.winningPrice,
                playersLimit: dataToInsert.playersLimit,
                roomId: dataToInsert.roomId,
                passwordToJoin: dataToInsert.passwordToJoin,
                contestFiles: dataToInsert.contestFiles,
                updatedBy: request.id,
                updatedAt: request.id,
            })
            
            return response.status(200).json({
                status: "SUCCESS",
                message: "Contest updated successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to update contest, please try again!",
            });
        }

    } catch (error) {
        console.log("error : ",error);
        
        response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
        return;
    }
};

module.exports = updateContest