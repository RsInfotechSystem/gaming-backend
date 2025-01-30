const coinServices = require("../../db.services.js/coin.service");
const { createCoinValidation } = require("../../utils/validation/coin.validation");


const createCoin = async (request, response) => {
    try {
        //extract data from request body
        const { valuePerCoin } = request.body;
        console.log("valuePerCoin : ", valuePerCoin)

        //check validation
        const validationResult = await createCoinValidation.validate({ valuePerCoin }, { abortEarly: true });
        if (validationResult.error) {
            response.status(200).json({
                status: "FAILED",
                message: validationResult?.error?.details[0]?.message,
            });
            return;
        }

        //check role already exist 
        // const isRoleExist = await roleServices.getRoleByName(name)
        // if (isRoleExist) {
        //     response.status(200).json({
        //         status: "FAILED",
        //         message: "Role already exist with this name",
        //     });
        //     return;
        // }

        // const dataToInsert = {
        //     name: name?.toLowerCase(),
        //     tab
        // }

        //Add role in db and send response to client
        const result = await coinServices.createCoin({ valuePerCoin: valuePerCoin });
        console.log("result : ", result);

        if (result) {
            return response.status(200).json({
                status: "SUCCESS",
                message: "Coin value added successfully",
            });
        } else {
            return response.status(200).json({
                status: "FAILED",
                message: "Failed to add value per coin, please try again!",
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

module.exports = createCoin