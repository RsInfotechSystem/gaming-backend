const contestServices = require("../../db.services.js/contest.service");
const { contestIdsValidationSchema } = require("../../utils/validation/contest.validation");


const deleteSelectedContest = async (request, response) => {
    try {
        //extract data from request body
        const contestIds = request.body.contestIds;

        //check validation
        const validationResult = await contestIdsValidationSchema.validate({ contestIds }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message
            });
            return;
        };

        const arrayLength = contestIds?.length;
        for (let i = 0; i < arrayLength; i++) {
            const id = contestIds[i];
            const isContestExist = await contestServices.getContestById(id);
            if (!isContestExist) {
                return response.status(200).json({
                    status: 'FAILED',
                    message: "Contest does not exist."
                });
            };
        };

        //delete the selected Contest from db and send response to client
        const result = await contestServices.deleteContest(contestIds);
        if (result > 0) {
            return response.status(200).json({
                status: 'SUCCESS',
                message: 'Contests deleted successfully.'
            });
        } else {
            return response.status(200).json({
                status: 'FAILED',
                message: 'Failed to delete contests.'
            });
        };
    } catch (error) {
        return response.status(500).json({
            status: 'FAILED',
            message: error.message
        });
    }
};


module.exports = deleteSelectedContest;