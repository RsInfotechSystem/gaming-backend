const { User, Location, Role } = require("../db/db");
const countPages = require("../utils/helper/count-pages");
const limit = Number(process.env.LIMIT) ?? 20; //number of documents have to show per page
const { Op } = require("sequelize");

const userServices = {
  getUserByMobile: async (mobile) => {
    try {
      return await User.findOne({
        where: { mobile: mobile, isDeleted: false },
      });
    } catch (error) {
      throw error;
    }
  },
  getLatestCreatedRecord: async () => {
    try {
      const latestRecord = await User.findOne({
        order: [["createdAt", "DESC"]], // Sort by `createdAt` in descending order
      });
      return latestRecord;
    } catch (error) {
      throw error;
    }
  },
  createUser: async (dataToInsert) => {
    try {
      return await User.create(dataToInsert);
    } catch (error) {
      throw error;
    }
  },
  getUserByObjId: async (userId) => {
    try {
      return await User.findOne({
        where: {
          id: userId,
          isDeleted: false,
        },
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["name"],
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },
  getUserByUserId: async (userId) => {
    try {
      return await User.findOne({
        where: {
          userId: userId,
          isDeleted: false,
        },
        include: [
          // {
          //     model: Location,
          //     as: 'location',
          //     attributes: ['name']
          // },
          {
            model: Role,
            as: "role",
            // attributes: ['name']
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  },
  getUserList: async (id, page = 1, searchString) => {
    try {
      let filter = {
        isDeleted: false,
        roleName: {
          [Op.ne]: "admin",
        },
        id: {
          [Op.ne]: id,
        },
      };

      if (searchString) {
        const searchRegex = `%${searchString}%`;

        // Find matching role and location IDs
        const [roleIds, locationIds] = await Promise.all([
          Role.findAll({
            where: {
              name: {
                [Op.iLike]: searchRegex,
              },
            },
            attributes: ["id"],
          }),
          Location.findAll({
            where: {
              name: {
                [Op.iLike]: searchRegex,
              },
            },
            attributes: ["id"],
          }),
        ]);

        const roleIdArray = roleIds.map((role) => role.id);
        const locationIdArray = locationIds.map((location) => location.id);

        filter[Op.or] = [
          { name: { [Op.iLike]: searchRegex } },
          { email: { [Op.iLike]: searchRegex } },
          { mobile: { [Op.iLike]: searchRegex } },
          { userId: { [Op.iLike]: searchRegex } },
          { locationId: { [Op.in]: locationIdArray } },
          { roleId: { [Op.in]: roleIdArray } },
        ];
      }

      const offset = (page - 1) * limit;
      const { count: totalRecords, rows: users } = await User.findAndCountAll({
        where: filter,
        order: [["createdAt", "DESC"]],
        limit,
        offset,
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["name", "tab"],
          },
          // {
          //     model: Location,
          //     as: 'location',
          //     attributes: ['name']
          // }
        ],
      });

      const totalPages = await countPages(totalRecords);
      return {
        totalPages,
        users,
      };
    } catch (error) {
      throw error;
    }
  },
  getUserByEmail: async (email) => {
    try {
      return await User.findOne({
        where: {
          email: email,
          isDeleted: false,
        },
      });
    } catch (error) {
      throw error;
    }
  },
  getExistingUserByMobileNo: async (userId, mobile) => {
    try {
      return await User.findOne({
        where: {
          id: { [Op.ne]: userId },
          mobile: mobile,
          isDeleted: false,
        },
      });
    } catch (error) {
      throw error;
    }
  },
  updateUserDetails: async (userId, dataToUpdate) => {
    try {
      const result = await User.update(dataToUpdate, {
        where: {
          id: userId,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
  updateUserPassword: async (userId, password) => {
    try {
      const result = await User.update(
        { password },
        {
          where: {
            userId: userId,
          },
        }
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteSelectedUsers: async (userIds) => {
    try {
      // Convert userIds to an array of UUIDs if necessary
      const result = await User.destroy({
        where: {
          id: userIds,
        },
        force: true, // This option ensures permanent deletion
      });

      return result; // Number of deleted rows
    } catch (error) {
      throw error;
    }
  },
  // getLocationWiseUser: async (locationId) => {
  //     try {
  //         return await User.findAll({
  //             where: {
  //                 locationId,
  //                 isDeleted: false
  //             }
  //         });
  //     } catch (error) {
  //         throw error;
  //     }
  // },
  getAdminInfo: async () => {
    try {
      const admins = await User.findAll({
        where: { role: "admin" },
        attributes: ["id"],
      });
      return admins;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userServices;
