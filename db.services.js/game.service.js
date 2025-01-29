const { Game, User } = require("../db/db");
const countPages = require("../utils/helper/count-pages");
const limit = Number(process.env.LIMIT) ?? 20; //number of documents have to show per page
const { Op } = require("sequelize");

const gameServices = {
  createGame: async (dataToInsert) => {
    try {
      return await Game.create(dataToInsert);
    } catch (error) {
      throw error;
    }
  },
  updateGame: async (gameId, dataToUpdate) => {
    try {
      return await Game.update(dataToUpdate, {
        where: {
          id: gameId,
          isDeleted: false,
        },
      });
    } catch (error) {
      throw error;
    }
  },
  getGameById: async (gameId) => {
    try {
      return await Game.findOne({
        where: {
          id: gameId,
          isDeleted: false,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  getGameList: async (page = 1, searchString) => {
    try {
      const filter = { isDeleted: false };

      const userFilter = searchString ? { name: { [Op.iLike]: `%${searchString}%` } } : {};

      if (searchString) {
        filter[Op.or] = [
          { name: { [Op.iLike]: `%${searchString}%` } },
          { description: { [Op.iLike]: `%${searchString}%` } },
          { title: { [Op.iLike]: `%${searchString}%` } },
          // { "$addedByUser.name$": { [Op.iLike]: `%${searchString}%` } }, // Search by addedBy user name,
          // { "$updatedByUser.name$": { [Op.iLike]: `%${searchString}%` } }, // Search by updatedBy user name
          // { playedCount: { [Op.iLike]: `%${searchString}%` } },
          // { isActive: { [Op.iLike]: `%${searchString}%` } },
        ];
      }

      // Count total records for pagination
      const totalRecords = await Game.count({
        where: filter,
        include: [
          { model: User, as: "addedByUser", where: userFilter, required: false, attributes: [] },
          { model: User, as: "updatedByUser", where: userFilter, required: false, attributes: [] }
        ]
      });

      // Fetch paginated records
      const gameList = await Game.findAll({
        where: filter,
        include: [
          { model: User, as: "addedByUser", where: userFilter, required: false, attributes: [] },
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
        gameList,
      };
    } catch (error) {
      throw error;
    }
  },

  getGameByName: async (gameName) => {
    try {
      return await Game.findOne({
        where: {
          name: gameName,
          isDeleted: false,
        },
      });
    } catch (error) {
      throw error;
    }
  },
  // deleteGame: async (modelIds) => {
  //   try {
  //     const objectIdArray = modelIds.map((id) => new ObjectId(id));
  //     return await Modal.deleteMany({ _id: { $in: objectIdArray } })
  //   } catch (error) {
  //     throw error;
  //   }
  // },
  deleteGame: async (gameIds) => {
    try {
      return await Game.update(
        {
          isDeleted: true,
        },
        {
          where: {
            id: gameIds,
            isDeleted: false,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },
  getActiveGame: async () => {
    try {
      return await Game.findAll({
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

module.exports = gameServices;
