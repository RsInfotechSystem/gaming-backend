const contestServices = require("../../db.services.js/contest.service");
const contestPlayerServices = require("../../db.services.js/contestPlayer.service");

const getContestWiseJoinedPlayerList = async (request, response) => {
    try{
        const { contestId } = request.body;

        const isContestExist = await contestServices.getContestById(contestId);
        if(!isContestExist){
            return response.status(200).json({
                status : "FAILED",
                message : "Contest does not exist"
            });
        }

        const joinedPlayers = await contestPlayerServices.getContestPlayersByContestId(contestId);
        if (joinedPlayers.length === 0) {
            return response.status(200).json({
              status: "FAILED",
              message: "No players has joined",
            });
          }
        
          const playerDetails = joinedPlayers.map((contestPlayer) => ({
            playerId: contestPlayer?.player?.id,
            name: contestPlayer?.player?.name,
            userName: contestPlayer?.player?.userName,
            email: contestPlayer?.player?.email,
            mobile: contestPlayer?.player?.mobile,
            gameUserName: contestPlayer?.gameUserName,
            gameUserId: contestPlayer?.gameUserId,
            joinDate: contestPlayer?.joinDate,
            contestName: contestPlayer?.contest?.name,
            contestDate: contestPlayer?.contest?.contestDate,
            contestTime: contestPlayer?.contest?.contestTime,
            gameType: contestPlayer?.contest?.gameType
        }));

        return response.status(200).json({
            status: "SUCCESS",
            message: "Player list fetched successfully",
            data: playerDetails
        });

    }catch(error){
        return response.status(500).json({
            status : "FAILED",
            message : error.message
        });
    }
}

module.exports = getContestWiseJoinedPlayerList