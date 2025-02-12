const { Transaction } = require("../db/db");

const transactionServices = {
    addTransaction : async (TransactionData) => {
        try{
            return await Transaction.create(TransactionData);
        }catch(error){
            throw error
        }
    },

}

module.exports = transactionServices;