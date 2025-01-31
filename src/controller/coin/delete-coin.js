const coinServices = require("../../db.services.js/coin.service");
const { deleteCoinValidation } = require("../../utils/validation/coin.validation");


const deleteCoin = async (request, response) => {
    try {
        //extract data from request body
        const { coinIds } = request.body;

        //check validation
        const validationResult = await deleteCoinValidation.validate({ coinIds }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        const arrayLength = coinIds?.length;
        for (let i = 0; i < arrayLength; i++) {
            const coinId = coinIds[i];
            console.log(" coinId : ", coinId)
            //check coin already exist 
            const isCoinExist = await coinServices.getCoinById(coinId)
            if (!isCoinExist) {
                response.status(200).json({
                    status: "FAILED",
                    message: "Coin doesdoes not exist",
                });
                return;
            }
        };

        //Add role in db and send response to client
        const result = await coinServices.deleteCoin(coinIds);

        if (result) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Coin value deleted successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to delete value per coin, please try again!",
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

module.exports = deleteCoin