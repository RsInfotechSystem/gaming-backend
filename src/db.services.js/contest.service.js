const { Contest, User, Game } = require("../db/db");
const countPages = require("../utils/helper/count-pages");
const limit = Number(process.env.LIMIT) ?? 20; //number of documents have to show per page
const { Op } = require("sequelize");

const contestServices = {
    createContest: async (dataToInsert) => {
        try {
            return await Contest.create(dataToInsert);
        } catch (error) {
            throw error;
        }
    },
    updateContest: async (contestId, dataToUpdate) => {
        try {
            return await Contest.update(dataToUpdate, {
                where: {
                    id: contestId,
                    isDeleted: false,
                },
            });
        } catch (error) {
            throw error;
        }
    },
    getContestById: async (contestId) => {
        try {
            return await Contest.findOne({
                where: {
                    id: contestId,
                    isDeleted: false,
                },
            });
        } catch (error) {
            throw error;
        }
    },

    getContestList: async (page = 1, searchString) => {
        try {
            const filter = { isDeleted: false };

            const userFilter = searchString ? { name: { [Op.iLike]: `%${searchString}%` } } : {};
            const gameFilter = searchString ? { name: { [Op.iLike]: `%${searchString}%` } } : {};

            if (searchString) {
                filter[Op.or] = [
                    { name: { [Op.iLike]: `%${searchString}%` } },
                    { description: { [Op.iLike]: `%${searchString}%` } },
                    // { title: { [Op.iLike]: `%${searchString}%` } },
                    // { "$addedByUser.name$": { [Op.iLike]: `%${searchString}%` } }, // Search by addedBy user name,
                    // { "$updatedByUser.name$": { [Op.iLike]: `%${searchString}%` } }, // Search by updatedBy user name
                    // { playedCount: { [Op.iLike]: `%${searchString}%` } },
                    // { isActive: { [Op.iLike]: `%${searchString}%` } },
                ];
            }

            // Count total records for pagination
            const totalRecords = await Contest.count({
                where: filter
            });

            // Fetch paginated records
            const contestList = await Contest.findAll({
                where: filter,
                include: [
                    { model: Game, as: "game", where: gameFilter, required: false, attributes: ["id", "name"] },
                    { model: User, as: "createdByUser", where: userFilter, required: false, attributes: [] },
                    { model: User, as: "updatedByUser", where: userFilter, required: false, attributes: [] }
                ],
                order: [["updatedAt", "DESC"]],
                limit: limit,
                offset: (page - 1) * limit,
            });

            //calculate total pages
            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                contestList,
            };
        } catch (error) {
            throw error;
        }
    },
    getJoinedContestList: async (page = 1, searchString, contestArray) => {
        try {
            const filter = {
                isDeleted: false,
                id: { [Op.in]: contestArray } // Filter contests based on ID array
            };

            if (searchString) {
                filter[Op.or] = [
                    { name: { [Op.iLike]: `%${searchString}%` } },
                    { description: { [Op.iLike]: `%${searchString}%` } }
                ];
            }

            // Count total records for pagination
            const totalRecords = await Contest.count({ where: filter });

            // Fetch paginated records
            const contestList = await Contest.findAll({
                where: filter,
                order: [["updatedAt", "DESC"]],
                limit: limit,
                offset: (page - 1) * limit,
            });

            // Calculate total pages
            const totalPages = await countPages(totalRecords);

            return {
                totalPages,
                contestList,
            };
        } catch (error) {
            throw error;
        }
    },
    getContestWinsList: async (page = 1, searchString, id) => {
        try {
            const filter = { isDeleted: false, winner: id };

            const userFilter = searchString ? { name: { [Op.iLike]: `%${searchString}%` } } : {};
            const gameFilter = searchString ? { name: { [Op.iLike]: `%${searchString}%` } } : {};

            if (searchString) {
                filter[Op.or] = [
                    { name: { [Op.iLike]: `%${searchString}%` } },
                    { description: { [Op.iLike]: `%${searchString}%` } },
                    // { title: { [Op.iLike]: `%${searchString}%` } },
                    // { "$addedByUser.name$": { [Op.iLike]: `%${searchString}%` } }, // Search by addedBy user name,
                    // { "$updatedByUser.name$": { [Op.iLike]: `%${searchString}%` } }, // Search by updatedBy user name
                    // { playedCount: { [Op.iLike]: `%${searchString}%` } },
                    // { isActive: { [Op.iLike]: `%${searchString}%` } },
                ];
            }

            // Count total records for pagination
            const totalRecords = await Contest.count({
                where: filter
            });

            // Fetch paginated records
            const contestList = await Contest.findAll({
                where: filter,
                include: [
                    { model: Game, as: "game", where: gameFilter, required: false, attributes: [] },
                    { model: User, as: "createdByUser", where: userFilter, required: false, attributes: [] },
                    { model: User, as: "updatedByUser", where: userFilter, required: false, attributes: [] }
                ],
                order: [["updatedAt", "DESC"]],
                limit: limit,
                offset: (page - 1) * limit,
            });

            //calculate total pages
            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                contestList,
            };
        } catch (error) {
            throw error;
        }
    },
    getContestByName: async (name) => {
        try {
            return await Contest.findOne({
                where: {
                    name: name,
                    isDeleted: false,
                },
            });
        } catch (error) {
            throw error;
        }
    },
    // deleteContest: async (contestIds) => {
    //   try {
    //     const objectIdArray = contestIds.map((id) => new ObjectId(id));
    //     return await Contest.deleteMany({ _id: { $in: objectIdArray } })
    //   } catch (error) {
    //     throw error;
    //   }
    // },
    deleteContest: async (contestIds) => {
        try {
            return await Contest.update(
                {
                    isDeleted: true,
                },
                {
                    where: {
                        id: contestIds,
                        isDeleted: false,
                    },
                }
            );
        } catch (error) {
            throw error;
        }
    },
    deleteContestByGameId : async (gameId) => {
        try{
            return await Contest.update(
                {
                    isDeleted: true,
                },
                {
                    where : {
                        gameId : gameId,
                        isDeleted : false,
                    },
                }
            )
        }catch(error){
            throw error
        }
    } ,
    getActiveContest: async () => {
        try {
            return await Contest.findAll({
                where: {
                    isActive: true,
                    isDeleted: false,
                },
            });
        } catch (error) {
            throw error;
        }
    },
    getGameWiseContestList: async (page = 1, searchString, gameId) => {
        try {
            const filter = {
                isDeleted: false,
                gameId: gameId
            }

            if (searchString) {
                filter[Op.or] = [
                    { name: { [Op.iLike]: `%${searchString}%` } },
                    { description: { [Op.iLike]: `%${searchString}%` } },
                ];
            }

            const totalRecords = await Contest.count({
                where: filter,
                include: [
                    { model: Game, as: "game", where: { id: gameId }, required: true },
                ],

            });

            const contestList = await Contest.findAll({
                where: filter,
                include: [
                    { model: Game, as: "game", where: { id: gameId }, required: true },
                ],
                order: [["updatedAt", "DESC"]],
                limit: limit,
                offset: (page - 1) * limit,
            })

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                contestList,
            };

        } catch (error) {
            throw error;
        }
    },

    getUpcomingContestList: async (page) => {
        try {
            const currentDate = new Date();
            const currentDateString = currentDate.toISOString().split("T")[0];
            const currentTimeString = currentDate.toISOString().split("T")[1].split(".")[0]

            const filter = {
                isDeleted: false,
                contestDate: {
                    [Op.gte]: currentDateString,
                },
                contestTime: {
                    [Op.gte]: currentTimeString,
                },
            }

            const totalRecords = await Contest.count({
                where: filter,
            });

            const contestList = await Contest.findAll({
                where: filter,
                order: [["contestDate", "ASC"], ["contestTime", "ASC"]],
                limit: limit,
                offset: (page - 1) * limit,
            });

            const totalPages = await countPages(totalRecords);

            return {
                totalPages,
                contestList,
            };

        } catch (error) {
            throw error;
        }
    },

    getWinnerPlayerList: async (page, searchString) => {
        try {
            const filter = {
                isDeleted: false,
                winner: {
                    [Op.ne]: null,
                }
            };

            if (searchString) {
                filter[Op.or] = [
                    { name: { [Op.iLike]: `%${searchString}%` } },
                    { description: { [Op.iLike]: `%${searchString}%` } },
                ];
            }

            const totalRecords = await Contest.count({
                where: filter,
            });

            const WinningPlayerList = await Contest.findAll({
                attributes: [
                    'gameId',
                    'gameType',
                    'winner',
                    [fn('COUNT', col('winner')), 'totalWins'],
                ],
                where: filter,
                group: ["gameId", "gameType", "winner"],
                include: [
                    {
                        model: Game,
                        as: 'game',
                        attributes: ['id', 'name'], // Include game name or other details as needed
                    },
                    {
                        model: Player,
                        as: 'winnerPlayer',
                        attributes: ['id', 'name'], // Include player name or other details as needed
                    },
                ],

                order: [
                    ['gameId', 'ASC'],
                    ['gameType', 'ASC'],
                    ['winner', 'ASC'],
                ],
                limit: limit,
                offset: (page - 1) * limit,
            });

            const totalPages = await countPages(totalRecords);

            return {
                totalPages,
                WinningPlayerList,
            };
        } catch (error) {
            throw error;
        }
    },

    getGameWiseUpcomingContestList: async (page = 1, searchString, gameId) => {
        try {
            const currentDate = new Date();
            const currentDateString = currentDate.toISOString().split("T")[0];
            const currentTimeString = currentDate.toISOString().split("T")[1].split(".")[0]

            const filter = {
                isDeleted: false,
                gameId: gameId,
                contestDate: {
                    [Op.gte]: currentDateString,
                },
                contestTime: {
                    [Op.gte]: currentTimeString,
                },
            }

            if (searchString) {
                filter[Op.or] = [
                    { name: { [Op.iLike]: `%${searchString}%` } },
                    { description: { [Op.iLike]: `%${searchString}%` } },
                ];
            }

            const totalRecords = await Contest.count({
                where: filter,
                include: [
                    { model: Game, as: "game", where: { id: gameId }, required: true },
                ],
            });

            const contestList = await Contest.findAll({
                where: filter,
                include: [
                    { model: Game, as: "game", where: { id: gameId }, required: true },
                ],
                // order: [["updatedAt", "DESC"]],
                order: [["contestDate", "ASC"], ["contestTime", "ASC"]],
                limit: limit,
                offset: (page - 1) * limit,
            })

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                contestList,
            };

        } catch (error) {
            throw error;
        }
    },
};

module.exports = contestServices;
