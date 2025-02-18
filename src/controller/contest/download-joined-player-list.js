const contestServices = require("../../db.services.js/contest.service");
const contestPlayerServices = require("../../db.services.js/contestPlayer.service");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const downloadJoinedPlayerListExcel = async (request, response) => {
    try {
        const { contestId } = request.body;

        if (!contestId) {
            return response.status(200).json({
                status: "FAILED",
                message: "contestId is required"
            })
        }

        const isContestExist = await contestServices.getContestById(contestId);
        if (!isContestExist) {
            return response.status(200).json({
                status: "FAILED",
                message: "Contest does not exist"
            });
        }

        const joinedPlayers = await contestPlayerServices.getContestPlayersByContestId(contestId);
        if (!joinedPlayers || joinedPlayers.length === 0) {
            return response.status(200).json({
                status: "FAILED",
                message: "No players have joined !",
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
        XLSX.utils.book_append_sheet(workbook, worksheet);

        // const baseFolder = path.resolve(__dirname, "..", "..", "public");
        // const excelFolder = path.join(baseFolder, "excels");    
        // await fs.ensureDir(excelFolder); // Ensure directory exists

        // Create directory if not exists
        const downloadDir = path.join(__dirname, "../../../public/excels");
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // Create a file name
        const contestName = isContestExist.name.replace(/\s+/g, "_"); // Replace spaces with underscores
        const contestDate = new Date(isContestExist.contestDate).toISOString().split('T')[0];
        const contestTime = isContestExist.contestTime.replace(/:/g, "-");
        const fileName = `${contestName}_${contestDate}_${contestTime}_PlayerList.xlsx`;

        //file path
        const filePath = path.join(downloadDir, fileName);
        console.log("filePath : ", filePath);

        //Generate Excel file
        XLSX.writeFile(workbook, filePath);

        // const downloadURL = `${request.protocol}://${request.get('host')}/public/excels/${fileName}`;
        // console.info("Download URL:", downloadURL);

        // Send file for download
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        response.sendFile(filePath, (err) => {
            if (err) {
                console.error("Error in sending file:", err);
                return response.status(500).json({
                    status: "FAILED",
                    message: "Error in sending file"
                });
            }

            // Delete file after download
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting file:", err);
            });


        });


    } catch (error) {
        return response.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
}

module.exports = downloadJoinedPlayerListExcel;