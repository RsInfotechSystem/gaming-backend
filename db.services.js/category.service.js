const { Category } = require("../db/db");
const countPages = require("../utils/helper/count-pages");
const limit = Number(process.env.LIMIT) ?? 20  //number of documents have to show per page
const { Op } = require('sequelize');

const categoryServices = {
    getCategoryByName: async (name) => {
        try {
            return await Category.findOne({ where: { name: name.toLowerCase(), isDeleted: false } });
        } catch (error) {
            throw error;
        }
    },
    createCategory: async (dataToInsert) => {
        try {
            return await Category.create(dataToInsert)
        } catch (error) {
            throw error;
        }
    },
    getCategoryList: async (page = 1, searchString) => {
        try {
            // Build filter object for Sequelize
            let filter = {
                isDeleted: false
            };

            if (searchString) {
                filter.name = {
                    [Op.iLike]: `%${searchString}%` // Using PostgreSQL case-insensitive LIKE operator
                };
            };

            if (page < 1) {
                page = 1
            };

            // Count total records
            const totalRecords = await Category.count({ where: filter });

            // Fetch paginated data
            const category = await Category.findAll({
                where: filter,
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: (page - 1) * limit
            });
            // Calculate total pages
            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                category
            };
        } catch (error) {
            throw error;
        }
    },
    getCategoryById: async (categoryId) => {
        try {
            return await Category.findOne({ where: { id: categoryId } });
        } catch (error) {
            throw error;
        }
    },
    getExistingCategoryByName: async (id, category) => {
        try {
            // Convert `id` to UUID if necessary
            const existingCategory = await Category.findOne({
                where: {
                    id: {
                        [Op.ne]: id // Sequelize equivalent of $ne for UUID
                    },
                    name: category
                }
            });

            return existingCategory;
        } catch (error) {
            throw error;
        }
    },
    updateCategoryDetails: async (categoryId, dataToUpdate) => {
        try {
            const result = await Category.update(dataToUpdate, {
                where: {
                    id: categoryId // Use the UUID or primary key column
                }
            });
            return result; // Number of rows affected
        } catch (error) {
            throw error;
        }
    },
    deleteSelectedCategory: async (categoryIds) => {
        try {
            // Convert categoryIds to an array of UUIDs if necessary
            const result = await Category.destroy({
                where: {
                    id: categoryIds
                }
            });

            return result; // Number of deleted rows
        } catch (error) {
            throw error;
        }
    },
    getActiveCategory: async () => {
        try {
            const category = await Category.findAll({
                where: {
                    isDeleted: false
                },
                attributes: ['name', 'id'],
                order: [['name', 'ASC']]
            });

            return category;
        } catch (error) {
            throw error;
        }
    }
};


module.exports = categoryServices;