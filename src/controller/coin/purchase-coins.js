const transactionServices = require("../../db.services.js/transaction.service");
const coinServices = require("../../db.services.js/coin.service");
const playerServices = require("../../db.services.js/player.service");
const purchaseHistoryService = require("../../db.services.js/purchaseHistory.service");
const {purchaseCoinValidation} = require("../../utils/validation/coin.validation")
const getPaymentDetails = require("../../utils/helper/razor.pay");

const purchaseCoins = async (request, response) => {
  try {
    const { name, mobile, email } = request;
    // const bookingData = JSON.parse(request.body.bookingData);

    //extract data from request body
    const { coinId, transactionId } = request.body;

    //check validation
    const validationResult = await purchaseCoinValidation.validate(
      {
        name,
        mobile: mobile?.toString(),
        email,
        coinId,
        transactionId,
      },
      { abortEarly: true }
    );

    if (validationResult.error) {
      response.status(200).json({
        status: "FAILED",
        message: validationResult?.error?.details[0]?.message,
      });
      return;
    }

    const isCoinExist = await coinServices.getCoinById(coinId);
    if (!isCoinExist) {
      return response.status(200).json({
        status: "FAILED",
        message: "Invalid Coin ID : Coin data does not found",
      });
    }

    const coinsCount = isCoinExist.coinsCount;

    const isPlayerExist = await playerServices.getPlayerByEmailAndMobile(email,mobile);
    if (!isPlayerExist) {
      return response.status(200).json({
        status: "FAILED",
        message: "Player Not Found",
      });
    }

    const updatePlayerCoins = await playerServices.updatePlayerAvailableCoins(
      email,
      coinsCount
    );
    if (!updatePlayerCoins) {
      return response.status(500).json({
        status: "FAILED",
        message: "Failed to update player coins please try again",
      });
    }

    const instance = await getPaymentDetails();
    const value = await instance.payments.fetch(transactionId);
    const amount = (value?.amount / 100).toFixed(2);
    const TransactionData = {
      name,
      mobile,
      email,
      coinsCount,
      amount,
      transactionId: value?.id,
      paymentType: value?.method,
      acquirer_data:
        value?.method === "card" ? value?.card : value?.acquirer_data,
    };

    const purchaseHistoryData = {
      playerId: isPlayerExist.id,
      email,
      coinsCount,
      amount,
      transactionId: value?.id,
    };

    const createPurchaseHistory =
      await purchaseHistoryService.createPurchaseHistory(purchaseHistoryData);

    if (!createPurchaseHistory) {
      return response.status(200).json({
        status: "FAILED",
        message: "Failed to create purchase history",
      });
    }

    // const socketUser = memberId ? [memberId] : [];

    const result = await transactionServices.addTransaction(TransactionData);
    if (result?.id) {
      return response.status(200).json({
        status: "SUCCESS",
        message: `Coin Purchased successfully`,
      });
    } else {
        return response.status(200).json({
        status: "FAILED",
        message: "Failed to Purchase Coins",
      });
      
    }
  } catch (error) {
    return response.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

module.exports = purchaseCoins;
