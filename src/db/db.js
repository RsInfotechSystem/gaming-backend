const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();

// Destructure variables from .env for easier usage
const { DB_URL, DB_SSL } = process.env;

// Initialize Sequelize using the DB_URL
const sequelize = new Sequelize(DB_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: DB_SSL === "true" ? {require : true , rejectUnauthorized: false} : false, // Convert the string "true" to a boolean
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
sequelize
    .authenticate()
    .then(() => {
        console.log("connected to neon database...🟢");
    })
    .catch((err) => {
        console.log("Database connection error: ❌" + err);
        throw err;
    });


// Import models
const Role = require("../model/role.model")(sequelize, DataTypes);
const Location = require("../model/location.model")(sequelize, DataTypes);
const User = require("../model/user.model")(sequelize, DataTypes);
const Notification = require("../model/notification.model")(sequelize, DataTypes)
const Game = require("../model/game.model")(sequelize, DataTypes);
const Coin = require("../model/coin.model")(sequelize, DataTypes);
const Contest = require("../model/contest.model")(sequelize, DataTypes);
const Player = require("../model/player.model")(sequelize, DataTypes);
const PurchaseHistory = require("../model/purchaseHistory.model")(sequelize, DataTypes);
const Transaction = require("../model/transaction.model")(sequelize, DataTypes);
const ContestPlayer = require("../model/contestPlayer.model")(sequelize, DataTypes);

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });



Game.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });
Game.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });

Contest.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });
// Contest.belongsTo(Player, { foreignKey: 'joinedPlayers', as: 'players' });
Contest.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });
Contest.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });

Player.hasMany(PurchaseHistory, {
    foreignKey: 'playerId',
    as: 'purchaseHistories'
});
PurchaseHistory.belongsTo(Player, {
    foreignKey: 'playerId',
    as: 'player'
});

Contest.hasMany(ContestPlayer, { foreignKey : "contestId", as :"joinedPlayers"});
ContestPlayer.belongsTo(Contest,{foreignKey : "contestId", as : "contest"});
Player.hasMany(ContestPlayer, {foreignKey : "playerId", as: "contestsJoined"})
ContestPlayer.belongsTo(Player, {foreignKey : "playerId", as : "player" })


// Game.belongsTo(Coin, { foreignKey: 'coinId', as: 'coin' });   

//!------------when command is npm run dev----------------------------
//? No need of this code, remove it
// sequelize.sync({ alter: true, logging: console.log }).then(() => {
//     console.log(" Tables creation process done!");
//     process.exit(0);
// }).catch(err => {
//     console.error("Migration failed:", err);
//     process.exit(1);
// });



module.exports = { sequelize, Role, Location, User, Notification, Game, Player, Coin, Contest, Transaction, PurchaseHistory, ContestPlayer};