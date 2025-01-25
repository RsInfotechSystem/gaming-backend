const { Block, Location } = require("../db/db");
const limit = Number(process.env.LIMIT) ?? 20  //number of documents have to show per page
const { Op } = require('sequelize');
const countPages = require("../utils/helper/count-pages");

const blockServices = {
    getBlockByBlockNo: async (blockNo) => {
        try {
            return await Block.findOne({ where: { blockNo: blockNo, isDeleted: false } });
        } catch (error) {
            throw error;
        }
    },
    createBlock: async (dataToInsert) => {
        try {
            return await Block.create(dataToInsert)
        } catch (error) {
            throw error;
        }
    },
    getBlockById: async (blockId) => {
        try {
            return await Block.findOne({
                where: {
                    id: blockId,
                    isDeleted: false
                },
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                    }
                ]
            });
        } catch (error) {
            throw error;
        }
    },
    getExistingBlockByName: async (blockId, blockNo) => {
        try {
            return await Block.findOne({
                where: {
                    id: {
                        [Op.ne]: blockId
                    },
                    blockNo
                },
                include: {
                    model: Location,
                    as: 'location',
                    attributes: ['name', 'isActive']
                }
            });
        } catch (error) {
            throw error;
        }
    },
    updateBlockDetails: async (blockId, dataToUpdate) => {
        try {
            const result = await Block.update(dataToUpdate, {
                where: {
                    id: blockId // Use the UUID or primary key column
                }
            });
            return result; // Number of rows affected
        } catch (error) {
            throw error;
        }
    },
    getBlockList: async (page = 1, searchString) => {
        try {
            // Build filter object for Sequelize
            let filter = {
                isDeleted: false
            };

            if (searchString) {
                const searchRegex = `%${searchString}%`;

                // Find matching location IDs
                const locationIds = await Location.findAll({
                    where: {
                        name: {
                            [Op.iLike]: searchRegex
                        }
                    },
                    attributes: ['id']
                });

                const locationIdArray = locationIds.map(location => location.id);

                filter[Op.or] = [
                    { blockNo: { [Op.iLike]: searchRegex } },
                    { locationId: { [Op.in]: locationIdArray } }
                ];
            }

            const offset = (page - 1) * limit;
            const { count: totalRecords, rows: blocks } = await Block.findAndCountAll({
                where: filter,
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                    }
                ]
            });

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                blocks
            };
        } catch (error) {
            throw error;
        }
    },
    deleteSelectedBlock: async (blockIds) => {
        try {
            // Convert userIds to an array of UUIDs if necessary
            const result = await Block.destroy({
                where: {
                    id: blockIds
                },
                force: true // This option ensures permanent deletion
            });

            return result; // Number of deleted rows
        } catch (error) {
            throw error;
        }
    },
    getActiveBlock: async () => {
        try {
            const activeBlocks = await Block.findAll({
                where: {
                    isDeleted: false,
                    isActive: true
                },
                attributes: ['blockNo'],
                order: [['blockNo', 'ASC']],
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name', 'isActive']
                    }
                ]
            });

            return activeBlocks;
        } catch (error) {
            throw error;
        }
    },
};


module.exports = blockServices;