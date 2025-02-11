const coinServices = require("../../db.services.js/coin.service");

const getCoinById = async (request, response) => {
  try {
    const { coinId } = request.body;

    if (!coinId) {
      return response.status(200).json({
        status: "FAILED",
        message: "Id is missing",
      });
    }

    const coin = await coinServices.getCoinById(coinId);

    if (!coin) {
      return response.status(200).json({
        status: "FAILED",
        message: "Failed to get coin please try again",
      });
    }

    return response.status(200).json({
      status: "SUCCESS",
      message: "Coin fetch successfully",
      coin: coin,
    });
  } catch (error) {
    return response.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

module.exports = getCoinById;
