const authenticateUserJWT = require("../utils/middleware/auth");
const createWallet = require("../controller/wallet/create-wallet");



const walletRoutes = require("express").Router();

walletRoutes.post("/create-wallet", authenticateUserJWT, createWallet);


module.exports = walletRoutes;