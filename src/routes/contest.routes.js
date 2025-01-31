const createContest = require("../controller/contest/create-contest");
const updateContest = require("../controller/contest/update-contest");
const authenticateUserJWT = require("../utils/middleware/auth");
const tabAccessMiddleware = require("../utils/middleware/tab-access-middleware");
const getContestList = require("../controller/contest/get-contest-list");
const getContestById = require("../controller/contest/get-contest-by-id");
const deleteSelectedContest = require("../controller/contest/delete-contest");
const getActiveContest = require("../controller/contest/get-active-contest");

const contestRoutes = require("express").Router();

//!--------------Contest Routes---------------------
contestRoutes.post("/create-contest", authenticateUserJWT, tabAccessMiddleware("game list"), createContest);
contestRoutes.post("/update-contest", authenticateUserJWT, tabAccessMiddleware("game list"), updateContest);
contestRoutes.post("/get-contest-list", authenticateUserJWT, tabAccessMiddleware("game list"), getContestList);
contestRoutes.post("/get-contest-by-id", authenticateUserJWT, tabAccessMiddleware("game list"), getContestById);
contestRoutes.get("/get-active-contest", authenticateUserJWT, tabAccessMiddleware("game list"), getActiveContest)
contestRoutes.post("/delete-contest", authenticateUserJWT, tabAccessMiddleware("game list"), deleteSelectedContest);


module.exports = contestRoutes;
