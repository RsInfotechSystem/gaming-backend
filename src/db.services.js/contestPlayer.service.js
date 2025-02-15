const { ContestPlayer, Player, Contest } = require("../db/db");
const { Op } = require("sequelize");

const contestPlayerServices = {
  createContestPlayer: async (dataToInsert) => {
    try {
      return await ContestPlayer.create(dataToInsert);
    } catch (error) {
      throw error;
    }
  },
  getContestByPlayerIdAndContestId: async (id, contestId) => {
    try {
      return await ContestPlayer.findOne({
        where: { playerId: id, contestId: contestId },
      });
    } catch (error) {
      throw error;
    }
  },
  countPlayersInContest: async (contestId) => {
    try {
      return await ContestPlayer.count({ where: { contestId } });
    } catch (error) {
      throw error;
    }
  },
  getContestPlayersByContestId: async (contestId) => {
    try {
      return await ContestPlayer.findAll({
        where: { contestId: contestId },
        include: [
          {
            model: Player,
            as: "player",
            attributes: ["id", "name", "userName", "email", "mobile"],
          },
          {
            model: Contest,
            as: "contest",
            attributes: ["name", "contestDate", "contestTime", "gameType"],
          },
        ],
        attributes: ["gameUserName", "joinDate"],
      });
    } catch (error) {
      throw error;
    }
  },
};

module.exports = contestPlayerServices;
