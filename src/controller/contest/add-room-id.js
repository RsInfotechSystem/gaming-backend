const contestServices = require("../../db.services.js/contest.service");
const { addRoomIdvalidation } = require("../../utils/validation/contest.validation");


const addRoomId = async (request, response) => {
    try {
        //extract data from request body
        const { contestId, roomId, password } = request.body;

        //check validation
        const validationResult = await addRoomIdvalidation.validate({ id: contestId, roomId, password }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        };

        //check contest exist or not
        const contest = await contestServices.getContestById(contestId);
        if (!contest?.id) {
            response.status(200).json({
                status: "FAILED",
                message: "Contest does not exist"
            });
            return;
        }

        const dataToUpdate = {
            roomId,
            passwordToJoin: password
        }
        //update contest details & send response to client also add socket here
        const result = await contestServices.updateContest(contestId, dataToUpdate);
        if (result) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Room Id & password added Successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to update contest details, please try again!",
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};

module.exports = addRoomId;