const authenticatePlayerJWT = require("../utils/middleware/auth-player");
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

const contestRoutes = require("express").Router();

//!--------------Contest Routes---------------------
contestRoutes.post("/create-contest", authenticatePlayerJWT, createContest);
contestRoutes.post("/update-contest", authenticatePlayerJWT, updateContest);
contestRoutes.post("/get-contest-list", authenticatePlayerJWT, getContestList);
contestRoutes.post("/get-contest-by-id", authenticatePlayerJWT, getContestById);
contestRoutes.get("/get-active-contest", authenticatePlayerJWT, getActiveContest)
contestRoutes.post("/delete-contest", authenticatePlayerJWT, deleteSelectedContest);
contestRoutes.post("/join-contest", authenticatePlayerJWT, joinContest);
contestRoutes.post("/get-joined-contest-list", authenticatePlayerJWT, getJoinedContestList);
contestRoutes.post("/declare-winner", authenticatePlayerJWT, declareWinner);


module.exports = contestRoutes;
