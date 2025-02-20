const authenticatePlayerJWT = require("../utils/middleware/auth-player");
const authenticateUserJWT = require("../utils/middleware/auth");
const tabAccessMiddleware = require("../utils/middleware/tab-access-middleware");
const createContest = require("../controller/contest/create-contest");
const updateContest = require("../controller/contest/update-contest");
const getContestList = require("../controller/contest/get-contest-list");
const getContestById = require("../controller/contest/get-contest-by-id");
const deleteSelectedContest = require("../controller/contest/delete-contest");
const getActiveContest = require("../controller/contest/get-active-contest");
const joinContest = require("../controller/contest/join-contest");
const getJoinedContestList = require("../controller/contest/get-joined-contest-list");
const declareWinner = require("../controller/contest/declare-winner");
const getContestWinsList = require("../controller/contest/contest-wins-list");
const getGameWiseContestList = require("../controller/contest/get-game-wise-contest-list");
const getUpcomingContestList = require("../controller/contest/get-upcoming-contest-list");
const getWinnerPlayerList = require("../controller/contest/get-winning-player-list");
const addRoomId = require("../controller/contest/add-room-id");
const getContestWiseJoinedPlayerList = require("../controller/contest/get-contest-wise-joined-player-list")
const getGameWiseUpcomingContestList = require("../controller/contest/get-game-wise-upcoming-contest-list");
const downloadJoinedPlayerListExcel = require("../controller/contest/download-joined-player-list");
const requestPayment = require("../controller/contest/request-payment");

const contestRoutes = require("express").Router();

//!--------------Contest Routes---------------------
contestRoutes.post("/create-contest", authenticateUserJWT, createContest);
contestRoutes.post("/update-contest", authenticateUserJWT, updateContest);
contestRoutes.post("/get-contest-list", authenticatePlayerJWT, getContestList);
contestRoutes.post("/get-admin-contest-list", authenticateUserJWT, getAdminContestList);
contestRoutes.post("/get-contest-by-id", authenticatePlayerJWT, getContestById);
contestRoutes.get("/get-active-contest", authenticatePlayerJWT, getActiveContest)
contestRoutes.post("/delete-contest", authenticatePlayerJWT, deleteSelectedContest);
contestRoutes.post("/join-contest", authenticatePlayerJWT, joinContest);
contestRoutes.post("/get-joined-contest-list", authenticatePlayerJWT, getJoinedContestList);
contestRoutes.post("/declare-winner", authenticateUserJWT, declareWinner);
contestRoutes.post("/contest-wins-list", authenticatePlayerJWT, getContestWinsList);
contestRoutes.post("/get-game-wise-contest-list", authenticatePlayerJWT, getGameWiseContestList);
contestRoutes.post("/get-upcoming-contest-list", authenticatePlayerJWT, getUpcomingContestList);
contestRoutes.post("/get-game-wise-upcoming-contest-list", authenticatePlayerJWT, getGameWiseUpcomingContestList);
contestRoutes.post("/get-winning-player-list", authenticatePlayerJWT, getWinnerPlayerList);
contestRoutes.post("/update-room-id", authenticateUserJWT, addRoomId);
contestRoutes.post("/get-contest-wise-joined-player-list",authenticateUserJWT, getContestWiseJoinedPlayerList);
contestRoutes.post("/download-joined-player-list",authenticatePlayerJWT,downloadJoinedPlayerListExcel);
contestRoutes.post("/request-payment",authenticatePlayerJWT,requestPayment);



module.exports = contestRoutes;
