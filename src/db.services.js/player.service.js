const { Player } = require("../db/db");
const limit = Number(process.env.LIMIT) ?? 20; //number of documents have to show per page
const { Op } = require("sequelize");
const countPages = require("../utils/helper/count-pages");

const playerServices = {
    createPlayer: async (dataToInsert) => {
        try {
            return await Player.create(dataToInsert);
        } catch (error) {
            throw error;
        }
    },
    getPlayerByEmail: async (email) => {
        try {
            return await Player.findOne({ where: { email: email?.toLowerCase(), isDeleted: false } });
        } catch (error) {
            throw error
        }
    },
    getPlayerById: async (playerId) => {
        try {
            return await Player.findOne({ where: { id: playerId, isDeleted: false } });
        } catch (error) {
            throw error;
        }
    },
    getPlayerByEmailAndMobile: async (email, mobile) => {
        try {
            return await Player.findOne({ where: { email: email?.toLowerCase(), mobile: mobile?.toString(), isDeleted: false } });
        } catch (error) {
            throw error;
        }
    },
    getPlayerByUsername: async (userName) => {
        try {
            return await Player.findOne({ where: { userName: userName?.toLowerCase() } });
        } catch (error) {
            throw error;
        }
    },
    getPlayerList: async (page = 1, searchString) => {
        try {
            // Build filter object for Sequelize
            let filter = {
                isDeleted: false,
            };

            // Add $or condition if searchString is provided
            if (searchString) {
                filter[Op.or] = [
                    {
                        name: {
                            [Op.iLike]: `%${searchString}%`, // Case-insensitive LIKE operator
                        },
                    },
                    {
                        userName: {
                            [Op.iLike]: `%${searchString}%`, // PostgreSQL specific operator for array containment
                        },
                    },
                ];
            }

            if (page < 1) {
                page = 1;
            }

            // Count total records
            const totalRecords = await Player.count({ where: filter });

            // Calculate total pages
            const totalPages = await countPages(totalRecords);

            // Fetch records
            const players = await Player.findAll({
                where: filter,
                limit: limit,
                offset: (page - 1) * limit,
                order: [["createdAt", "DESC"]],
            });

            return {
                players,
                totalPages,
                totalRecords
            };
        } catch (error) {
            throw error;
        }
    },
    getContestWisePlayerList: async (page = 1, searchString, playersArray) => {
        try {
            // Build filter object for Sequelize
            let filter = {
                isDeleted: false,
                id: { [Op.in]: playersArray }
            };

            // Add $or condition if searchString is provided
            if (searchString) {
                filter[Op.or] = [
                    {
                        name: {
                            [Op.iLike]: `%${searchString}%` // Case-insensitive LIKE operator
                        }
                    },
                    {
                        userName: {
                            [Op.iLike]: `%${searchString}%` // PostgreSQL specific operator for array containment
                        }
                    }
                ];
            }

            if (page < 1) {
                page = 1
            };

            // Count total records
            const totalRecords = await Player.count({ where: filter });

            // Calculate total pages
            const totalPages = await countPages(totalRecords);

            // Fetch records
            const players = await Player.findAll({
                where: filter,
                limit: limit,
                offset: (page - 1) * limit,
                order: [["createdAt", "DESC"]],
            });

            return {
                players,
                totalPages,
                totalRecords
            };
        } catch (error) {
            throw error;
        }
    },
    updatePlayer: async (playerId, dataToUpdate) => {
        try {
            return await Player.update(dataToUpdate, {
                where: { id: playerId, isDeleted: false }
            });
        } catch (error) {
            throw error;
        }
    },
    updatePlayerPassword: async (email, newPassword) => {
        try {
            return await Player.update({ password: newPassword }, { where: { email: email, isDeleted: false } });
        } catch (error) {
            throw error;
        }
    },
    updatePlayerAvailableCoins : async (email,coinsCount) => {
        try{
            return await Player.increment({availableCoins : coinsCount },{ where: { email: email, isDeleted: false } });
        }catch(error){
            throw error;
        }
    },
    deletePlayer: async (playerId) => {
        try {
            return await Player.update({ isDeleted: true }, { where: { id: playerId, isDeleted: false } });
        } catch (error) {
            throw error;
        }
    },
}

module.exports = playerServices;
