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

};

module.exports = contestServices;
