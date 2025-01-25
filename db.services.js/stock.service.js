const { Stock, Block, Category, Brand, Location, User, StockOut } = require("../db/db");
const countPages = require("../utils/helper/count-pages");
const limit = Number(process.env.LIMIT) ?? 20  //number of documents have to show per page
const { Op, fn, col, literal } = require('sequelize');

const stockServices = {
    getSerialNoWiseStockData: async (serialNo) => {
        try {
            return await Stock.findOne({ serialNo: serialNo });
        } catch (error) {
            throw error;
        }
    },
    getItemCodeWiseStockData: async (itemCode) => {
        try {
            return await Stock.findOne({ itemCode: itemCode });
        } catch (error) {
            throw error;
        }
    },
    addStock: async (dataToInsert) => {
        try {
            return await Stock.create(dataToInsert)
        } catch (error) {
            throw error;
        }
    },
    getStockList: async (page = 1, searchString, blockId, categoryId, conditionType, brandId, locationId, location) => {
        try {
            let filter = {
                isDeleted: false,
                status: { [Op.notIn]: ["stock-out", "NR Material"] }
            };

            if (locationId) {
                filter.locationId = locationId;
            }

            if (blockId) {
                filter.blockId = blockId;
            }

            if (categoryId) {
                filter.categoryId = categoryId;
            }

            if (conditionType) {
                filter.conditionType = conditionType;
            }

            if (brandId) {
                filter.brandId = brandId;
            }

            if (location) {
                filter.locationId = location;
            }

            if (searchString) {
                const searchRegex = `%${searchString}%`;

                const [locationIds, blockIds, categoryIds, brandIds] = await Promise.all([
                    Location.findAll({ where: { name: { [Op.iLike]: searchRegex } }, attributes: ['id'] }),
                    Block.findAll({ where: { blockNo: { [Op.iLike]: searchRegex } }, attributes: ['id'] }),
                    Category.findAll({ where: { name: { [Op.iLike]: searchRegex } }, attributes: ['id'] }),
                    Brand.findAll({ where: { name: { [Op.iLike]: searchRegex } }, attributes: ['id'] })
                ]);

                const locationIdArray = locationIds.map(location => location.id);
                const blockIdArray = blockIds.map(block => block.id);
                const categoryIdArray = categoryIds.map(category => category.id);
                const brandIdArray = brandIds.map(brand => brand.id);

                filter[Op.or] = [
                    { status: { [Op.iLike]: searchRegex } },
                    { itemCode: { [Op.iLike]: searchRegex } },
                    { serialNo: { [Op.iLike]: searchRegex } },
                    { locationId: { [Op.in]: locationIdArray } },
                    { blockId: { [Op.in]: blockIdArray } },
                    { categoryId: { [Op.in]: categoryIdArray } },
                    { brandId: { [Op.in]: brandIdArray } }
                ];
            }

            const offset = (page - 1) * limit;
            const { count: totalRecords, rows: stocks } = await Stock.findAndCountAll({
                where: filter,
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                include: [
                    { model: Location, as: 'location', attributes: ['name', 'id'] },
                    { model: Block, as: 'block', attributes: ['blockNo', 'id'] },
                    { model: Category, as: 'category', attributes: ['name', 'id'] },
                    { model: Brand, as: 'brand', attributes: ['name', 'id'] },
                    { model: User, as: "stockInByUser", attributes: ['name', 'id'] }
                ]
            });

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                stocks
            };
        } catch (error) {
            throw error
        }
    },
    getStockById: async (stockId) => {
        try {
            try {
                return await Stock.findOne({
                    where: {
                        id: stockId,
                        isActive: true,
                        isDeleted: false
                    },
                    include: [
                        { model: Location, as: 'location', attributes: ['name', 'id'] },
                        { model: Block, as: 'block', attributes: ['blockNo', 'id'] },
                        { model: Category, as: 'category', attributes: ['name', 'id'] },
                        { model: Brand, as: 'brand', attributes: ['name', 'id'] }
                    ]
                });
            } catch (error) {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    },
    updateStockDetail: async (stockId, dataToUpdate) => {
        try {
            const result = await Stock.update(dataToUpdate, {
                where: {
                    id: stockId // Use the UUID or primary key column
                }
            });
            return result; // Number of rows affected
        } catch (error) {
            throw error;
        }
    },
    getExistingStockByItemCode: async (stockId, itemCode) => {
        try {
            return await Stock.findOne({
                where: {
                    id: {
                        [Op.ne]: stockId
                    },
                    itemCode: itemCode
                }
            });
        } catch (error) {
            throw error;
        }
    },
    deleteSelectedStock: async (stockIds) => {
        try {
            // Convert userIds to an array of UUIDs if necessary
            const result = await Stock.destroy({
                where: {
                    id: stockIds
                },
                force: true // This option ensures permanent deletion
            });

            return result; // Number of deleted rows
        } catch (error) {
            throw error;
        }
    },
    getInventoryMaterial: async (page = 1, searchString, blockId, categoryId, conditionType, brandId, locationId, modelId, location) => {
        try {
            let filter = {
                isDeleted: false,
                status: {
                    [Op.notIn]: [
                        "stock-out",
                        "NR Material",
                        "assigned",
                        "added",
                        "accepted",
                        "approved",
                        "transfer",
                        "attached"
                    ]
                },
                remainingQuantity: { [Op.gt]: 0 }
            };

            if (locationId) {
                filter.locationId = locationId;
            }

            if (blockId) {
                filter.blockId = blockId;
            }

            if (categoryId) {
                filter.categoryId = categoryId;
            }

            if (conditionType) {
                filter.conditionType = conditionType;
            }

            if (brandId) {
                filter.brandId = brandId;
            }

            if (location) {
                filter.locationId = location;
            }

            if (searchString) {
                const searchRegex = `%${searchString}%`;

                const [locationIds, blockIds, categoryIds, brandIds] = await Promise.all([
                    Location.findAll({ where: { name: { [Op.iLike]: searchRegex } }, attributes: ['id'] }),
                    Block.findAll({ where: { blockNo: { [Op.iLike]: searchRegex } }, attributes: ['id'] }),
                    Category.findAll({ where: { name: { [Op.iLike]: searchRegex } }, attributes: ['id'] }),
                    Brand.findAll({ where: { name: { [Op.iLike]: searchRegex } }, attributes: ['id'] })
                ]);

                const locationIdArray = locationIds.map(location => location.id);
                const blockIdArray = blockIds.map(block => block.id);
                const categoryIdArray = categoryIds.map(category => category.id);
                const brandIdArray = brandIds.map(brand => brand.id);

                filter[Op.or] = [
                    { conditionType: { [Op.iLike]: searchRegex } },
                    { status: { [Op.iLike]: searchRegex } },
                    { itemCode: { [Op.iLike]: searchRegex } },
                    { serialNo: { [Op.iLike]: searchRegex } },
                    { locationId: { [Op.in]: locationIdArray } },
                    { blockId: { [Op.in]: blockIdArray } },
                    { categoryId: { [Op.in]: categoryIdArray } },
                    { brandId: { [Op.in]: brandIdArray } }
                ];
            };

            const offset = (page - 1) * limit;
            const { count: totalRecords, rows: stock } = await Stock.findAndCountAll({
                where: filter,
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                include: [
                    { model: Location, as: 'location', attributes: ['name', 'id'] },
                    { model: Block, as: 'block', attributes: ['blockNo', 'id'] },
                    { model: Category, as: 'category', attributes: ['name', 'id'] },
                    { model: Brand, as: 'brand', attributes: ['name', 'id'] },
                ]
            });

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                stock
            };
        } catch (error) {
            throw error;
        }
    },
    stockOut: async (dataToInsert) => {
        try {
            return await StockOut.create(dataToInsert)
        } catch (error) {
            throw error;
        }
    },
    getSellToApprove: async (page = 1, searchString) => {
        try {
            let filter = {
                isApprove: false
            };

            if (searchString) {
                const searchRegex = `%${searchString}%`;

                const [locationIds, blockIds, categoryIds, brandIds] = await Promise.all([
                    Location.findAll({ where: { name: { [Op.iLike]: searchRegex } }, attributes: ['id'] }),
                    Block.findAll({ where: { blockNo: { [Op.iLike]: searchRegex } }, attributes: ['id'] }),
                    Category.findAll({ where: { name: { [Op.iLike]: searchRegex } }, attributes: ['id'] }),
                    Brand.findAll({ where: { name: { [Op.iLike]: searchRegex } }, attributes: ['id'] })
                ]);

                const locationIdArray = locationIds.map(location => location.id);
                const blockIdArray = blockIds.map(block => block.id);
                const categoryIdArray = categoryIds.map(category => category.id);
                const brandIdArray = brandIds.map(brand => brand.id);

                filter[Op.or] = [
                    { conditionType: { [Op.iLike]: searchRegex } },
                    { status: { [Op.iLike]: searchRegex } },
                    { itemCode: { [Op.iLike]: searchRegex } },
                    { serialNo: { [Op.iLike]: searchRegex } },
                    { locationId: { [Op.in]: locationIdArray } },
                    { blockId: { [Op.in]: blockIdArray } },
                    { categoryId: { [Op.in]: categoryIdArray } },
                    { brandId: { [Op.in]: brandIdArray } },
                ];
            };

            const offset = (page - 1) * limit;
            const { count: totalRecords, rows: stocks } = await StockOut.findAndCountAll({
                where: filter,
                order: [['createdAt', 'DESC']],
                limit,
                offset,
                include: [
                    {
                        model: Stock,
                        as: 'stock',
                        attributes: [
                            'categoryId',
                            'modelId',
                            'locationId',
                            'brandId',
                            'conditionType',
                            'itemCode',
                            'serialNo'
                        ],
                        include: [
                            { model: Category, as: 'category', attributes: ['name', 'id'] },
                            { model: Location, as: 'location', attributes: ['name', 'id'] },
                            { model: Brand, as: 'brand', attributes: ['name', 'id'] },
                            { model: Block, as: 'block', attributes: ['blockNo', 'id'] },
                        ]
                    },
                    { model: User, as: 'stockOutBy', attributes: ['name', 'id'] }
                ]
            });

            const totalPages = await countPages(totalRecords);
            const formattedStocks = stocks.map(stock => ({
                ...stock.stock,
                ...stock
            }));


            return {
                totalPages,
                stock: formattedStocks
            };
        } catch (error) {
            throw error;
        }
    },
    getBrandCount: async (locationId) => {
        try {
            let whereCondition = {
                status: { [Op.notIn]: ['stock-out', 'NR', 'assigned'] },
                isDeleted: false,
                remainingQuantity: { [Op.gte]: 1 }
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            const data = await Stock.findAll({
                where: whereCondition,
                attributes: [
                    'brandId',
                    [fn('SUM', col('remainingQuantity')), 'count']
                ],
                include: [
                    {
                        model: Brand,
                        as: 'brand',
                        attributes: ['name']
                    }
                ],
                group: ['brandId', 'brand.id'],
                having: literal('SUM("remainingQuantity") > 0')
            })

            const result = data.map(item => ({
                _id: item.brandId,
                count: item.getDataValue('count'),
                brand: item.brand.name
            }));

            return result;
        } catch (error) {
            throw error;
        }
    },
    getCategoryCount: async (locationId) => {
        try {
            let whereCondition = {
                status: { [Op.notIn]: ['stock-out', 'NR', 'assigned'] },
                isDeleted: false,
                remainingQuantity: { [Op.gte]: 1 }
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            const data = await Stock.findAll({
                where: whereCondition,
                attributes: [
                    'categoryId',
                    [fn('SUM', col('remainingQuantity')), 'count']
                ],
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['name']
                    }
                ],
                group: ['categoryId', 'category.id'],
                having: literal('SUM("remainingQuantity") > 0')
            })

            const result = data.map(item => ({
                _id: item.categoryId,
                count: item.getDataValue('count'),
                category: item.category.name
            }));

            return result;
        } catch (error) {
            throw error;
        }
    },
    getLocationCount: async (locationId) => {
        try {
            let whereCondition = {
                status: { [Op.notIn]: ['stock-out', 'NR', 'assigned'] },
                isDeleted: false,
                remainingQuantity: { [Op.gte]: 1 }
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            const data = await Stock.findAll({
                where: whereCondition,
                attributes: [
                    'locationId',
                    [fn('SUM', col('remainingQuantity')), 'count']
                ],
                include: [
                    {
                        model: Location,
                        as: 'location',
                        attributes: ['name']
                    }
                ],
                group: ['locationId', 'location.id'],
                having: literal('SUM("remainingQuantity") > 0')
            });

            const result = data.map(item => ({
                _id: item.locationId,
                count: item.getDataValue('count'),
                location: item.location.name
            }));

            return result;
        } catch (error) {
            throw error;
        }
    },
    getStockStatusCount: async (locationId) => {
        try {
            let whereCondition = {
                status: { [Op.notIn]: ['stock-out', 'NR', 'assigned'] },
                isDeleted: false,
                remainingQuantity: { [Op.gte]: 1 }
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            const data = await Stock.findAll({
                where: whereCondition,
                attributes: [
                    'status',
                    [fn('SUM', col('remainingQuantity')), 'count']
                ],
                group: ['status'],
                having: literal('SUM("remainingQuantity") > 0')
            });

            const result = data.map(item => ({
                _id: item.status,
                count: item.getDataValue('count'),
                stockStatus: item.status
            }));

            return result;
        } catch (error) {
            throw error;
        }
    },
    getStockByCategoryId: async (categoryId, locationId, page = 1, searchString) => {
        try {
            let whereCondition = {
                stockStatus: { [Op.ne]: 'stock-out' },
                isDeleted: false,
                categoryId
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            if (searchString) {
                const searchRegex = { [Op.iLike]: `%${searchString}%` };

                whereCondition[Op.or] = [
                    { conditionType: searchRegex },
                    { status: searchRegex },
                    { modelName: searchRegex },
                    { itemCode: searchRegex },
                    { serialNo: searchRegex }
                ];
            };

            const offset = (page - 1) * limit;
            const { count: totalRecords, rows: stocks } = await Stock.findAndCountAll({
                where: whereCondition,
                include: [
                    { model: Location, as: 'location', attributes: ['name', 'id'] },
                    { model: Block, as: 'block', attributes: ['blockNo', 'id'] },
                    { model: Category, as: 'category', attributes: ['name', 'id'] },
                    { model: Brand, as: 'brand', attributes: ['name', 'id'] },
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            // Calculate total pages
            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                stocks
            };
        } catch (error) {
            throw error;
        }
    },
    getCategoryReportMaterialList: async (page = 1, searchString, categoryId, locationId, brandId, location) => {
        try {
            const offset = (page - 1) * limit;

            let whereCondition = {
                stockStatus: { [Op.notIn]: ['stock-out', 'NR', 'assigned'] },
                isDeleted: false,
                remainingQuantity: { [Op.gte]: 1 },
                categoryId
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            if (brandId) {
                whereCondition.brandId = brandId;
            };

            if (location) {
                whereCondition.locationId = location;
            };

            if (searchString) {
                const searchRegex = { [Op.iLike]: `%${searchString}%` };

                whereCondition[Op.or] = [
                    { conditionType: searchRegex },
                    { status: searchRegex },
                    { itemCode: searchRegex },
                    { serialNo: searchRegex },
                    { modelName: searchRegex }
                ];

                // Fetch related IDs based on searchString
                const [categories, locations, brands, blocks] = await Promise.all([
                    Category.findAll({ where: { name: searchRegex }, attributes: ['id'] }),
                    Location.findAll({ where: { name: searchRegex }, attributes: ['id'] }),
                    Brand.findAll({ where: { name: searchRegex }, attributes: ['id'] }),
                    Block.findAll({ where: { blockNo: searchRegex }, attributes: ['id'] }),
                ]);

                const categoryIdArray = categories.map(category => category.id);
                const locationIdArray = locations.map(location => location.id);
                const brandIdArray = brands.map(brand => brand.id);
                const blockIdArray = blocks.map(block => block.id);

                whereCondition[Op.or] = [
                    { categoryId: { [Op.in]: categoryIdArray } },
                    { locationId: { [Op.in]: locationIdArray } },
                    { brandId: { [Op.in]: brandIdArray } },
                    { blockId: { [Op.in]: blockIdArray } },
                    { conditionType: searchRegex },
                    { status: searchRegex },
                    { itemCode: searchRegex },
                    { serialNo: searchRegex },
                    { modelName: searchRegex }
                ];
            };

            const { count: totalRecords, rows: materials } = await Stock.findAndCountAll({
                where: whereCondition,
                include: [
                    { model: Location, as: 'location', attributes: ['name'] },
                    { model: Block, as: 'block', attributes: ['blockNo'] },
                    { model: Category, as: 'category', attributes: ['name'] },
                    { model: Brand, as: 'brand', attributes: ['name'] },
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            const totalPages = await countPages(totalRecords)
            return {
                totalPages,
                materials
            };
        } catch (error) {
            throw error;
        }
    },
    getLocationReportMaterialList: async (page = 1, searchString, location, locationId, categoryId, brandId) => {
        try {
            const offset = (page - 1) * limit;

            let whereCondition = {
                stockStatus: { [Op.notIn]: ['stock-out', 'NR', 'assigned'] },
                isDeleted: false,
                remainingQuantity: { [Op.gte]: 1 },
                locationId: location
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            if (categoryId) {
                whereCondition.categoryId = categoryId;
            };

            if (brandId) {
                whereCondition.brandId = brandId;
            };

            if (searchString) {
                const searchRegex = { [Op.iLike]: `%${searchString}%` };

                const returnFilter = {
                    [Op.or]: [
                        { name: searchRegex },
                        { blockNo: searchRegex },
                        { rackName: searchRegex }
                    ]
                };

                const [categories, locations, brands, blocks] = await Promise.all([
                    Category.findAll({ where: returnFilter, attributes: ['id'] }),
                    Location.findAll({ where: returnFilter, attributes: ['id'] }),
                    Brand.findAll({ where: returnFilter, attributes: ['id'] }),
                    Block.findAll({ where: returnFilter, attributes: ['id'] }),
                ]);

                const categoryIdArray = categories.map(category => category.id);
                const locationIdArray = locations.map(location => location.id);
                const brandIdArray = brands.map(brand => brand.id);
                const blockIdArray = blocks.map(block => block.id);

                whereCondition[Op.or] = [
                    { categoryId: { [Op.in]: categoryIdArray } },
                    { locationId: { [Op.in]: locationIdArray } },
                    { brandId: { [Op.in]: brandIdArray } },
                    { blockId: { [Op.in]: blockIdArray } },
                    { modelName: searchRegex },
                    { conditionType: searchRegex },
                    { status: searchRegex },
                    { itemCode: searchRegex },
                    { serialNo: searchRegex }
                ];
            };

            const { count: totalRecords, rows: materials } = await Stock.findAndCountAll({
                where: whereCondition,
                include: [
                    { model: Location, as: 'location', attributes: ['name'] },
                    { model: Block, as: 'block', attributes: ['blockNo'] },
                    { model: Category, as: 'category', attributes: ['name'] },
                    { model: Brand, as: 'brand', attributes: ['name'] },
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            })

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                materials
            };
        } catch (error) {
            throw error;
        }
    },
    getBrandReportMaterialList: async (page = 1, searchString, brandId, locationId, categoryId, location) => {
        try {
            const offset = (page - 1) * limit;

            let whereCondition = {
                stockStatus: { [Op.notIn]: ['stock-out', 'NR', 'assigned'] },
                isDeleted: false,
                remainingQuantity: { [Op.gte]: 1 },
                brandId: brandId
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            if (categoryId) {
                whereCondition.categoryId = categoryId;
            }

            if (location) {
                whereCondition.locationId = location;
            }

            if (searchString) {
                const searchRegex = { [Op.iLike]: `%${searchString}%` };

                const returnFilter = {
                    [Op.or]: [
                        { name: searchRegex },
                        { blockNo: searchRegex },
                        { rackName: searchRegex }
                    ]
                };

                const [categories, locations, brands, blocks] = await Promise.all([
                    Category.findAll({ where: returnFilter, attributes: ['id'] }),
                    Location.findAll({ where: returnFilter, attributes: ['id'] }),
                    Brand.findAll({ where: returnFilter, attributes: ['id'] }),
                    Block.findAll({ where: returnFilter, attributes: ['id'] }),
                ]);

                const categoryIdArray = categories.map(category => category.id);
                const locationIdArray = locations.map(location => location.id);
                const brandIdArray = brands.map(brand => brand.id);
                const blockIdArray = blocks.map(block => block.id);

                whereCondition[Op.or] = [
                    { categoryId: { [Op.in]: categoryIdArray } },
                    { locationId: { [Op.in]: locationIdArray } },
                    { brandId: { [Op.in]: brandIdArray } },
                    { blockId: { [Op.in]: blockIdArray } },
                    { modelName: searchRegex },
                    { conditionType: searchRegex },
                    { status: searchRegex },
                    { itemCode: searchRegex },
                    { serialNo: searchRegex }
                ];
            };

            const { count: totalRecords, rows: materials } = await Stock.findAndCountAll({
                where: whereCondition,
                include: [
                    { model: Location, as: 'location', attributes: ['name'] },
                    { model: Block, as: 'block', attributes: ['blockNo'] },
                    { model: Category, as: 'category', attributes: ['name'] },
                    { model: Brand, as: 'brand', attributes: ['name'] },
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                materials
            };
        } catch (error) {
            throw error;
        }
    },
    getStatusWiseReportMaterialList: async (page = 1, searchString, status, locationId, categoryId, brandId, location) => {
        try {
            const offset = (page - 1) * limit;

            let whereCondition = {
                status,
                remainingQuantity: { [Op.gte]: 1 },
                isDeleted: false
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            if (categoryId) {
                whereCondition.categoryId = categoryId;
            }

            if (location) {
                whereCondition.locationId = location;
            }

            if (brandId) {
                whereCondition.brandId = brandId;
            }

            if (searchString) {
                const searchRegex = { [Op.iLike]: `%${searchString}%` };

                const returnFilter = {
                    [Op.or]: [
                        { name: searchRegex },
                        { blockNo: searchRegex },
                        { rackName: searchRegex }
                    ]
                };

                const [categories, locations, brands, blocks] = await Promise.all([
                    Category.findAll({ where: returnFilter, attributes: ['id'] }),
                    Location.findAll({ where: returnFilter, attributes: ['id'] }),
                    Brand.findAll({ where: returnFilter, attributes: ['id'] }),
                    Block.findAll({ where: returnFilter, attributes: ['id'] }),
                ]);

                const categoryIdArray = categories.map(category => category.id);
                const locationIdArray = locations.map(location => location.id);
                const brandIdArray = brands.map(brand => brand.id);
                const blockIdArray = blocks.map(block => block.id);

                whereCondition[Op.or] = [
                    { categoryId: { [Op.in]: categoryIdArray } },
                    { locationId: { [Op.in]: locationIdArray } },
                    { brandId: { [Op.in]: brandIdArray } },
                    { blockId: { [Op.in]: blockIdArray } },
                    { modelName: searchRegex },
                    { conditionType: searchRegex },
                    { status: searchRegex },
                    { itemCode: searchRegex },
                    { serialNo: searchRegex }
                ];
            };

            const { count: totalRecords, rows: materials } = await Stock.findAndCountAll({
                where: whereCondition,
                include: [
                    { model: Location, as: 'location', attributes: ['name'] },
                    { model: Block, as: 'block', attributes: ['blockNo'] },
                    { model: Category, as: 'category', attributes: ['name'] },
                    { model: Brand, as: 'brand', attributes: ['name'] },
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            });

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                materials
            };
        } catch (error) {
            throw error;
        }
    },
    getStockOutMaterialList: async (date, page, searchString, locationId, categoryId, brandId, location) => {
        try {
            const offset = (page - 1) * limit;

            const startTime = new Date(date);
            const endTime = new Date(date);

            let whereCondition = {
                createdAt: {
                    [Op.between]: [
                        new Date(startTime.setHours(0, 0, 0, 0)),
                        new Date(endTime.setHours(23, 59, 59, 999))
                    ]
                },
                status: 'stock-out'
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            if (searchString) {
                const searchRegex = `%${searchString}%`;

                const searchFilter = {
                    [Op.or]: [
                        { name: { [Op.iLike]: searchRegex } },
                        { blockNo: { [Op.iLike]: searchRegex } },
                        { rackName: { [Op.iLike]: searchRegex } }
                    ]
                };

                const [locations, blocks, categories, brands] = await Promise.all([
                    Location.findAll({ where: searchFilter, attributes: ['id'] }),
                    Block.findAll({ where: searchFilter, attributes: ['id'] }),
                    Category.findAll({ where: searchFilter, attributes: ['id'] }),
                    Brand.findAll({ where: searchFilter, attributes: ['id'] }),
                ]);

                const locationIdArray = locations.map(loc => loc.id);
                const blockIdArray = blocks.map(block => block.id);
                const categoryIdArray = categories.map(cat => cat.id);
                const brandIdArray = brands.map(brand => brand.id);

                whereCondition[Op.or] = [
                    { conditionType: { [Op.iLike]: searchRegex } },
                    { status: { [Op.iLike]: searchRegex } },
                    { itemCode: { [Op.iLike]: searchRegex } },
                    { serialNo: { [Op.iLike]: searchRegex } },
                    { locationId: { [Op.in]: locationIdArray } },
                    { blockId: { [Op.in]: blockIdArray } },
                    { categoryId: { [Op.in]: categoryIdArray } },
                    { brandId: { [Op.in]: brandIdArray } },
                ];
            }

            const { count: totalRecords, rows: materials } = await StockOut.findAndCountAll({
                where: whereCondition,
                include: [
                    {
                        model: Stock,
                        as: 'stock',
                        attributes: ["categoryId", 'locationId', 'brandId', "conditionType", "itemCode", "serialNo"],
                        include: [
                            { model: Category, as: 'category', attributes: ["name", "id"] },
                            { model: Location, as: 'location', attributes: ["name", "id"] },
                            { model: Brand, as: 'brand', attributes: ["name", "id"] },
                            { model: Block, as: 'block', attributes: ["blockNo", "id"] }
                        ]
                    },
                    {
                        model: User,
                        as: 'stockOutBy',
                        attributes: ["name", "id"]
                    }
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset
            })

            let filteredMaterials = materials;

            if (categoryId) {
                filteredMaterials = filteredMaterials.filter(m => m.stock && m.stock.categoryId && m.stock.categoryId.toString() === categoryId.toString());
            };

            if (brandId) {
                filteredMaterials = filteredMaterials.filter(m => m.stock && m.stock.brandId && m.stock.brandId.toString() === brandId.toString());
            };

            if (location) {
                filteredMaterials = filteredMaterials.filter(m => m.stock && m.stock.locationId && m.stock.locationId.toString() === location.toString());
            };

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                material: filteredMaterials.map(ele => ({
                    ...ele.stock,
                    materialId: ele.id,
                    ...ele,
                    locationId: ele.stock.locationId
                }))
            };
        } catch (error) {
            throw error;
        }
    },
    getStockOutMaterialCount: async (startDate, endDate) => {
        try {
            const fifteenDaysAgo = new Date(new Date() - 15 * 24 * 60 * 60 * 1000);
            let whereCondition = {
                status: "approved",
                createdAt: {
                    [Op.gte]: fifteenDaysAgo,
                }
            };

            if (startDate && endDate) {
                const startTime = new Date(startDate);
                const endTime = new Date(endDate);
                whereCondition.createdAt = {
                    [Op.between]: [
                        new Date(startTime.setHours(0, 0, 1, 0)),
                        new Date(endTime.setHours(23, 59, 0, 0))
                    ]
                };
            };

            const result = await StockOut.findAll({
                where: whereCondition,
                attributes: [
                    [fn('DATE_TRUNC', 'day', col('createdAt')), 'date'],
                    [fn('COUNT', col('*')), 'count']
                ],
                group: [literal('date')],
                order: [[literal('date'), 'ASC']]
            });

            return result.map(item => ({
                date: item.get('date'),
                count: item.get('count')
            }));
        } catch (error) {
            throw error;
        }
    },
    getNonReplacableStockList: async (page = 1, searchString, locationId, blockId, categoryId, conditionType, brandId, location) => {
        try {
            const filter = {
                isDeleted: false,
                status: "NR Material"
            };

            if (locationId) {
                whereCondition.locationId = locationId;
            };

            if (blockId) {
                filter.blockId = blockId;
            }

            if (categoryId) {
                filter.categoryId = categoryId;
            }

            if (conditionType) {
                filter.conditionType = conditionType;
            }

            if (brandId) {
                filter.brandId = brandId;
            }

            if (location) {
                filter.locationId = location;
            }

            if (searchString) {
                const searchRegex = `%${searchString}%`;

                const inventoryFilter = {
                    [Op.or]: [
                        { name: { [Op.iLike]: searchRegex } },
                        { blockNo: { [Op.iLike]: searchRegex } },
                    ]
                };

                const [locationIds, blockIds, categoryIds, brandIds] = await Promise.all([
                    Location.findAll({ where: inventoryFilter, attributes: ['id'] }),
                    Block.findAll({ where: inventoryFilter, attributes: ['id'] }),
                    Category.findAll({ where: inventoryFilter, attributes: ['id'] }),
                    Brand.findAll({ where: inventoryFilter, attributes: ['id'] })
                ]);

                const locationIdArray = locationIds.map(location => location.id);
                const blockIdArray = blockIds.map(block => block.id);
                const categoryIdArray = categoryIds.map(category => category.id);
                const brandIdArray = brandIds.map(brand => brand.id);

                filter[Op.or] = [
                    { conditionType: { [Op.iLike]: searchRegex } },
                    { status: { [Op.iLike]: searchRegex } },
                    { itemCode: { [Op.iLike]: searchRegex } },
                    { serialNo: { [Op.iLike]: searchRegex } },
                    { locationId: { [Op.in]: locationIdArray } },
                    { blockId: { [Op.in]: blockIdArray } },
                    { categoryId: { [Op.in]: categoryIdArray } },
                    { brandId: { [Op.in]: brandIdArray } }
                ];
            }

            const offset = (page - 1) * limit;
            const totalRecords = await Stock.count({ where: filter });
            const stock = await Stock.findAll({
                where: filter,
                order: [['createdAt', 'DESC']],
                offset,
                limit,
                include: [
                    { model: Location, attributes: ['name'] },
                    { model: Block, attributes: ['blockNo'] },
                    { model: Category, attributes: ['name'] },
                    { model: Brand, attributes: ['name'] },
                ],
                raw: true
            });

            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                stock
            };
        } catch (error) {
            throw error;
        }
    },
    sellNRmaterial: async (stockId, type) => {
        try {

        } catch (error) {
            throw error;
        }
    }
};


module.exports = stockServices;