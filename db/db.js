const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();

// console.log("DB URL : ",process.env.DB_URL);
// console.log('DB_SSL:', process.env.DB_SSL);

const sequelize = new Sequelize("postgresql://postgres:manthan@localhost:5432/postgres", {
    dialect: "postgres",
    dialectOptions: {
        ssl: process.env.DB_SSL == "true",
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
const Category = require("../model/category.model")(sequelize, DataTypes);
const Block = require("../model/block.model")(sequelize, DataTypes);
const Brand = require("../model/brand.model")(sequelize, DataTypes);
const Stock = require("../model/stock.model")(sequelize, DataTypes);
const StockOut = require("../model/stock-out.model")(sequelize, DataTypes);
const Notification = require("../model/notification.model")(sequelize, DataTypes)
const Game = require("../model/game.model")(sequelize, DataTypes);

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
User.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });

Block.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
Brand.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Stock.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
Stock.belongsTo(Block, { foreignKey: 'blockId', as: 'block' });
Stock.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Stock.belongsTo(Brand, { foreignKey: 'brandId', as: 'brand' });
Stock.belongsTo(User, { foreignKey: 'stockInBy', as: 'stockInByUser' });
Stock.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedToUser' });
Stock.belongsTo(User, { foreignKey: 'assignedBy', as: 'assignedByUser' });

// StockOut.belongsTo(Stock, { foreignKey: 'stockId', as: 'stock' });
// StockOut.belongsTo(User, { foreignKey: 'stockOutById', as: 'stockOutBy' })
// Stock.belongsTo(Stock, { foreignKey: 'addedIn', as: 'addedInStock' });


Game.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// Game.belongsTo(Coin, { foreignKey: 'coinId', as: 'coin' });

//!------------when command is npm run dev----------------------------
//? No need of this code, remove it
// sequelize.sync({ alter: true , logging: console.log }).then(() => {
//     console.log(" Tables creation process done!");
//     process.exit(0);
// }).catch(err => {
//     console.error("Migration failed:", err);
//     process.exit(1);
// });



module.exports = { sequelize, Role, Location, Category, User, Block, Brand, Stock, StockOut, Notification }