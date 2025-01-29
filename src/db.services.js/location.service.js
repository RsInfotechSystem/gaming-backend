const { Location } = require("../db/db");
const limit = Number(process.env.LIMIT) ?? 20  //number of documents have to show per page
const { Op } = require('sequelize');
const countPages = require("../utils/helper/count-pages");


const locationServices = {
    getLocationByName: async (name) => {
        try {
            return await Location.findOne({ where: { name: name.toLowerCase() } });
        } catch (error) {
            throw error
        }
    },
    createLocation: async (dataToInsert) => {
        try {
            return await Location.create(dataToInsert);
        } catch (error) {
            throw error;
        }
    },
    getLocationList: async (page = 1, searchString) => {
        try {
            let filter = {};
            if (searchString) {
                filter.name = {
                    [Op.iLike]: `%${searchString}%` // Using PostgreSQL case-insensitive LIKE operator
                };
            }

            const { count: totalRecords, rows: location } = await Location.findAndCountAll({
                where: filter,
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: (page - 1) * limit
            });

            const totalPages = await countPages(totalRecords);

            return {
                totalPages,
                location
            };
        } catch (error) {
            throw error;
        }
    },
    getLocationById: async (locationId) => {
        try {
            return await Location.findOne({ where: { id: locationId } });
        } catch (error) {
            throw error;
        }
    },
    updateLocationDetails: async (locationId, dataToUpdate) => {
        try {
            const result = await Location.update(dataToUpdate, {
                where: {
                    id: locationId // Use the UUID or primary key column
                }
            });
            return result; // Number of rows affected
        } catch (error) {
            throw error;
        }
    },
    getActiveLocationsList: async () => {
        try {
            const location = await Location.findAll({
                where: {
                    isActive: true
                },
                attributes: ['name', 'id'],
                order: [['name', 'ASC']]
            });

            return location;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = locationServices;