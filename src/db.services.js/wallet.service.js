const {Wallet} = require("../db/db");
const { Op } = require("sequelize");
// const countPages = require("../utils/helper/count-pages");
// const limit = Number(process.env.LIMIT) ?? 20; //number of documents have to show per page

const walletServices = {
    createWallet : async (walletData) => {
        try{
            return await Wallet.create(walletData);
        }catch(error){
            throw error;
        }
    },
    updateWallet : async (walletId, walletData) => {
        try{
            return await Wallet.update(walletData, {
                where : {
                    id : walletId
                }
            })
        }catch(error){
            throw error;
        }
    },
    getWalletByPlayerId : async (playerId) => {
        try{
            return await Wallet.findOne({
                where : {
                    playerId : playerId
                }
            })
        }catch (error) {
            throw error;
        }
    },
    deleteWallet : async (walletId) => {
        try{
            return await Wallet.destroy({
                where : {
                    id : walletId
                }
            })
        }catch(error){
            throw error;
        }
    }
}

module.exports = walletServices;