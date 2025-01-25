const { Brand, Category } = require("../db/db");
const limit = Number(process.env.LIMIT) ?? 20  //number of documents have to show per page
const { Op } = require('sequelize');
const countPages = require("../utils/helper/count-pages");

const brandServices = {
    getBrandByName: async (name, categoryId) => {
        try {
            const brand = await Brand.findOne({
                where: {
                    name: name.toLowerCase(),
                    categoryId
                },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name', 'isReplaceable', 'isDeleted']
                    }
                ]
            });

            return brand;
        } catch (error) {
            throw error;
        }
    },
    createBrand: async (dataToInsert) => {
        try {
            return await Brand.create(dataToInsert)
        } catch (error) {
            throw error;
        }
    },
    getBrandById: async (brandId) => {
        try {
            return await Brand.findOne({
                where: {
                    id: brandId,
                    isDeleted: false
                },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name', 'isReplaceable', 'isDeleted']
                    }
                ]
            });
        } catch (error) {
            throw error;
        }
    },
    deleteSelectedBrand: async (brandIds) => {
        try {
            // Convert brandIds to an array of UUIDs if necessary
            const result = await Brand.destroy({
                where: {
                    id: brandIds
                },
                force: true // This option ensures permanent deletion
            });

            return result; // Number of deleted rows
        } catch (error) {
            throw error;
        }
    },
    getBrandList: async (page = 1, searchString, categoryId) => {
        try {
            let filter = {
                isDeleted: false
            };

            if (categoryId) {
                filter.categoryId = categoryId;
            }

            if (searchString) {
                const searchPattern = `%${searchString}%`;
                const categoryFilter = {
                    [Op.or]: [
                        { name: { [Op.iLike]: searchPattern } }
                    ]
                };

                const categories = await Category.findAll({
                    where: categoryFilter,
                    attributes: ['id']
                });

                const categoryIdArray = categories.map(category => category.id);

                filter[Op.or] = [
                    { name: { [Op.iLike]: searchPattern } },
                    { categoryId: { [Op.in]: categoryIdArray } }
                ];
            };

            const offset = (page - 1) * limit;
            const { count: totalRecords, rows: brands } = await Brand.findAndCountAll({
                where: filter,
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name', 'isReplaceable', 'isDeleted']
                    }
                ]
            });

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                brands
            };
        } catch (error) {
            throw error;
        }
    },
    getExistingBrandByName: async (id, name) => {
        try {
            return await Brand.findOne({
                where: {
                    id: {
                        [Op.ne]: id
                    },
                    name: name.toLowerCase()
                },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name', 'isReplaceable']
                    }
                ]
            });
        } catch (error) {
            throw error;
        }
    },
    updateBrandDetails: async (brandId, dataToUpdate) => {
        try {
            const result = await Brand.update(dataToUpdate, {
                where: {
                    id: brandId // Use the UUID or primary key column
                }
            });
            return result; // Number of rows affected
        } catch (error) {
            throw error;
        }
    },
    getActiveBrand: async () => {
        try {
            return await Brand.findAll({
                where: {
                    isDeleted: false
                },
                attributes: ['name'],
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name', 'isReplaceable']
                    }
                ]
            });
        } catch (error) {
            throw error;
        }
    },
    getCategoryWiseBrand: async (categoryId) => {
        try {
            return await Brand.findAll({
                where: {
                    categoryId,
                    isDeleted: false
                }
            });
        } catch (error) {
            throw error;
        }
    }
};


module.exports = brandServices;