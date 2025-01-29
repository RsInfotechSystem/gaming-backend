const { Game } = require("../db/db");
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
      const filter = {
        isDeleted: false,
      };

      if (searchString) {
        filter[Op.or] = [
          {
            name: {
              [Op.iLike]: `%${searchString}%`,
            },
          },
          {
            title: {
              [Op.iLike]: `%${searchString}%`,
            },
          },
        ];
      }

      if (page < 1) {
        page = 1;
      }

      //count total records
      const totalRecords = await Game.count({
        where: filter,
      });

      //Fetch paginated records
      const gamelist = await Game.findAll({
        where: filter,
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: (page - 1) * limit,
      });

      //calculate total pages
      const totalPages = countPages(totalRecords);
      return {
        totalPages,
        gamelist,
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
  deleteGame: async (gameId) => {
    try {
      return await Game.update(
        {
          isDeleted: true,
        },
        {
          where: {
            id: gameId,
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
