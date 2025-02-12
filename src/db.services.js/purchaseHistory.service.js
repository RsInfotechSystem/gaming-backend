const { PurchaseHistory } = require("../db/db");

const purchaseHistoryService = {
createPurchaseHistory : async (purchaseHistoryData) => {
        try{
            return await PurchaseHistory.create(purchaseHistoryData);
        }catch(error){
            throw error;
        }
    },
}

module.exports = purchaseHistoryService;