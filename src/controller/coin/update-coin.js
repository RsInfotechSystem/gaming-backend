const coinServices = require("../../db.services.js/coin.service");
const { updateCoinValidation } = require("../../utils/validation/coin.validation");


const updateCoin = async (request, response) => {
    try {
        //extract data from request body
        const { coinId, coinsCount, rupeesAmt } = request.body;

        //check validation
        const validationResult = await updateCoinValidation.validate({ coinId, coinsCount, rupeesAmt }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //check coin already exist 
        const isCoinExist = await coinServices.getCoinById(coinId)
        if (!isCoinExist) {
            response.status(200).json({
                status: "FAILED",
                message: "Coin does not exist",
            });
            return;
        }

        // const dataToInsert = {
        //     name: name?.toLowerCase(),
        //     tab
        // }

        //Add role in db and send response to client
        const result = await coinServices.updateCoin(coinId, { coinsCount, rupeesAmt });

        if (result) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Coin value updated successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to update value per coin, please try again!",
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

module.exports = updateCoin