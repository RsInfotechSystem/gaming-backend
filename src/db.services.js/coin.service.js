const { Coin } = require("../db/db");
const limit = Number(process.env.LIMIT) ?? 20  //number of documents have to show per page
const { Op } = require('sequelize');
const countPages = require("../utils/helper/count-pages");

const coinServices = {
    createCoin: async (dataToInsert) => {
        try {
            return await Coin.create(dataToInsert);
        } catch (error) {
            throw error;
        }
    },
    getCoinList: async () => {
        try {
            const coinList = await Coin.findAll({
                order: [["updatedAt", "DESC"]],
            })

             return {
                coinList,
                totalRecords
             };

        }catch(error){
            throw error;
        }
    },
    getCoinById: async (coinId) => {
        try {
            return await Coin.findOne({ where: { id: coinId } });
        } catch (error) {
            throw error;
        }
    },
    updateCoin: async (coinId, dataToUpdate) => {
        try {
            const result = await Coin.update(dataToUpdate, {
                where: {
                    id: coinId // Use the UUID or primary key column
                }
            });
            return result; // Number of rows affected
        } catch (error) {
            throw error;
        }
    },
    deleteCoin: async (coinIds) => {
        try {
            // Convert coinIds to an array of UUIDs if necessary
            const result = await Coin.destroy({
                where: {
                    id: coinIds
                }
            });
            return result; // Number of deleted rows
        } catch (error) {
            throw error;
        }
    },
};

module.exports = coinServices