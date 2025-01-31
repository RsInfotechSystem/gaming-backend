const contestServices = require("../../db.services.js/contest.service");
const { idValidation } = require("../../utils/validation/role.validation");


const getContestById = async (request, response) => {
    try {
        //extract ContestId from request body
        const contestId = request.body.contestId;

        //check validation
        const validationResult = await idValidation.validate({ id: contestId }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        };

        //check role exist or not
        const contest = await contestServices.getContestById(contestId);

        if (contest?.id) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Contest details fetched successfully",
                contest
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Contest does not exist"
            });
            return;
        }
    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        })
    }
};

module.exports = getContestById;