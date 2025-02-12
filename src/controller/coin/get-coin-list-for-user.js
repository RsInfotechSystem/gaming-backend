const coinServices = require("../../db.services.js/coin.service");

const getCoinListForUser = async (request, response) => {
    try {
        // const {page} = request.body;

        const coinList = await coinServices.getCoinList()
        if (coinList?.totalRecords > 0) {
            response.status(200).json({
                status: "SUCCESS",
                message: "Coin fetch successfully",
                ...coinList
            });
            return;
        } else {
            response.status(200).json({
                status: "FAILED",
                message: "Coin not available",
            });
            return;
        }

    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
}

module.exports = getCoinListForUser;