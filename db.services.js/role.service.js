const { Role } = require("../db/db");
const limit = Number(process.env.LIMIT) ?? 20  //number of documents have to show per page
const { Op } = require('sequelize');
const countPages = require("../utils/helper/count-pages");

const roleServices = {
    getRoleByName: async (name) => {
        try {
            return await Role.findOne({ where: { name: name?.toLowerCase(), isDeleted: false } });
        } catch (error) {
            throw error
        }
    },
    createRole: async (dataToInsert) => {
        try {
            return await Role.create(dataToInsert);
        } catch (error) {
            // console.log("error while creation : ", error)

            throw error;
        }
    },
    getRoleById: async (roleId) => {
        try {
            return await Role.findOne({ where: { id: roleId, isDeleted: false } });
        } catch (error) {
            throw error;
        }
    },
    getRoleList: async (page = 1, searchString) => {
        try {
            // Build filter object for Sequelize
            let filter = {
                isDeleted: false,
                name: {
                    [Op.ne]: "admin" // Sequelize equivalent of $ne operator
                }
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
                        tab: {
                            [Op.contains]: [searchString] // PostgreSQL specific operator for array containment
                        }
                    }
                ];
            }

            if (page < 1) {
                page = 1
            };

            // Count total records
            const totalRecords = await Role.count({ where: filter });

            // Fetch paginated data
            const roles = await Role.findAll({
                where: filter,
                order: [['createdAt', 'DESC']],
                limit: limit,
                offset: (page - 1) * limit
            });
            // Calculate total pages
            const totalPages = await countPages(totalRecords);
            return {
                totalPages,
                roles
            };
        } catch (error) {
            throw error;
        }
    },
    getExistingRoleByName: async (id, name) => {
        try {
            // Convert `id` to UUID if necessary
            const existingRole = await Role.findOne({
                where: {
                    id: {
                        [Op.ne]: id // Sequelize equivalent of $ne for UUID
                    },
                    name
                }
            });

            return existingRole;
        } catch (error) {
            throw error;
        }
    },
    updateRoleDetails: async (roleId, dataToUpdate) => {
        try {
            const result = await Role.update(dataToUpdate, {
                where: {
                    id: roleId // Use the UUID or primary key column
                }
            });
            return result; // Number of rows affected
        } catch (error) {
            throw error;
        }
    },
    deleteSelectedRoles: async (roleIds) => {
        try {
            // Convert roleIds to an array of UUIDs if necessary
            const result = await Role.destroy({
                where: {
                    id: roleIds
                }
            });

            return result; // Number of deleted rows
        } catch (error) {
            throw error;
        }
    },
    getActiveRole: async () => {
        try {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.ne]: "admin"
                    },
                    isDeleted: false
                },
                attributes: ['role', 'id'],
                order: [['role', 'ASC']]
            });

            return roles;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = roleServices