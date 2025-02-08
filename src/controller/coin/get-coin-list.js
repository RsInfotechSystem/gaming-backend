const coinServices = require("../../db.services.js/coin.service");

const getCoinList = async (request, response) => {
    try{
        // const {page} = request.body;

        const result = await coinServices.getCoinList()
        if (result.totalPages > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Coin fetch successfully",
                ...result
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Coin not available",
            });
            return;
        }

    }catch(error){
        return response.status(500).json({
            status : "FAILED",
            message : error.message
        });
    }
}

module.exports = getCoinList;