const contestServices = require("../../db.services.js/contest.service");
const contestPlayerServices = require("../../db.services.js/contestPlayer.service");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const downloadJoinedPlayerList = async (request, response) => {
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
              status: "SUCCESS",
              message: "No players have joined this contest yet",
              data: []
            });
          }
        
          const playerDetails = joinedPlayers.map((contestPlayer) => ({
            playerId: contestPlayer?.player?.id,
            name: contestPlayer?.player?.name,
            userName: contestPlayer?.player?.userName,
            email: contestPlayer?.player?.email,
            mobile: contestPlayer?.player?.mobile,
            gameUserName: contestPlayer?.gameUserName,
            joinDate: contestPlayer?.joinDate,
            contestName: contestPlayer?.contest?.name,
            contestDate: contestPlayer?.contest?.contestDate,
            contestTime: contestPlayer?.contest?.contestTime,
            gameType: contestPlayer?.contest?.gameType
        }));

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(playerDetails);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Joined Players");



        // Create directory if not exists
        const downloadDir = path.join(__dirname, "../../public/downloads");
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // Generate Excel file
        const fileName = `ContestPlayers_${contestId}.xlsx`;
        const filePath = path.join(downloadDir, fileName);
        XLSX.writeFile(workbook, filePath);

         // Send file for download
         response.download(filePath, fileName, (err) => {
            if (err) {
                console.error("Error in downloading file:", err);
                return response.status(500).json({
                    status: "FAILED",
                    message: "Error in downloading file"
                });
            }

            // Delete file after download
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        });

        
    }catch(error){
        return response.status(500).json({
            status : "FAILED",
            message : error.message
        });
    }
}

module.exports = downloadJoinedPlayerList;