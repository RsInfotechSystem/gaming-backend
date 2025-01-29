const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();

// Destructure variables from .env for easier usage
const { DB_URL, DB_SSL } = process.env;

// Initialize Sequelize using the DB_URL
const sequelize = new Sequelize(DB_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: DB_SSL === "true", // Convert the string "true" to a boolean
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
        console.log("connected...🟢");
    })
    .catch((err) => {
        console.log("Error" + err);
        throw err;
    });


const Role = require("../model/role.model")(sequelize, DataTypes);
const Location = require("../model/location.model")(sequelize, DataTypes);
const User = require("../model/user.model")(sequelize, DataTypes);
const Notification = require("../model/notification.model")(sequelize, DataTypes)
const Game = require("../model/game.model")(sequelize, DataTypes);
const Player = require("../model/player.model")(sequelize, DataTypes);

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });



Game.belongsTo(User, { foreignKey: 'addedBy', as: 'addedByUser' });
Game.belongsTo(User, { foreignKey: 'updatedBy', as: 'updatedByUser' });
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



module.exports = { sequelize, Role, Location, User, Notification, Game,Player };