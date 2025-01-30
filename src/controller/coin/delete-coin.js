const coinServices = require("../../db.services.js/coin.service");
const { deleteCoinValidation } = require("../../utils/validation/coin.validation");


const deleteCoin = async (request, response) => {
    try {
        //extract data from request body
        const { coinId } = request.body;

        //check validation
        const validationResult = await deleteCoinValidation.validate({ coinId }, { abortEarly: true });
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
        const result = await coinServices.deleteCoin(coinId);

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
        console.log("FAILEDFAILEDFAILEDFAILEDFAILEDFAILEDFAILED : ", error)
        response.status(500).json({
            status: "FAILED",
            message: error.message,
        });
        return;
    }
};

module.exports = deleteCoin